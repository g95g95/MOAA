import { PrismaClient } from '@prisma/client';
import { ChangeRequestJobData, ChangeRequestStatus } from '@moaa/shared';
import { ClaudeService } from '../services/claude.service.js';
import { GitService } from '../services/git.service.js';

export async function processChangeRequest(
  data: ChangeRequestJobData,
  prisma: PrismaClient
): Promise<void> {
  const { changeRequestId, description, repositoryUrl, defaultBranch } = data;

  try {
    await prisma.changeRequest.update({
      where: { id: changeRequestId },
      data: { status: ChangeRequestStatus.PROCESSING },
    });

    const gitService = new GitService();
    const claudeService = new ClaudeService();

    const workDir = await gitService.cloneRepository(repositoryUrl, defaultBranch);

    const fileContents = await gitService.getRelevantFiles(workDir);

    const diff = await claudeService.generateDiff(description, fileContents);

    const branchName = `moaa/cr-${changeRequestId.slice(0, 8)}`;
    await gitService.createBranchAndApplyDiff(workDir, branchName, diff);

    await gitService.pushBranch(workDir, branchName);

    await prisma.changeRequest.update({
      where: { id: changeRequestId },
      data: {
        status: ChangeRequestStatus.AWAITING_REVIEW,
        branchName,
        diffContent: diff,
        aiResponse: `Successfully generated diff for: ${description}`,
      },
    });

    await gitService.cleanup(workDir);

    console.log(`Change request ${changeRequestId} processed successfully`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    await prisma.changeRequest.update({
      where: { id: changeRequestId },
      data: {
        status: ChangeRequestStatus.FAILED,
        errorMessage,
      },
    });

    throw error;
  }
}
