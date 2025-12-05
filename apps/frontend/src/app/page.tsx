import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-white shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">MOAA</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <div className="relative bg-white overflow-hidden">
          <div className="mx-auto max-w-7xl">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
              <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="text-center">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Code Changes</span>
                    <span className="block text-primary-600">Made Simple</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                    Describe what you need in plain English. Our AI understands your codebase and
                    generates production-ready changes automatically.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
                    <div className="rounded-md shadow">
                      <Link
                        href="/register"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                      >
                        Start Free Trial
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link
                        href="#features"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
              <p className="mt-4 text-lg text-gray-500">
                Three simple steps to automated code changes
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {/* Feature 1 */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white text-xl font-bold">
                    1
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Describe Your Change</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Write what you want in natural language. &quot;Add a dark mode toggle&quot; or &quot;Fix the
                    login validation bug.&quot;
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white text-xl font-bold">
                    2
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">AI Generates Code</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Our AI analyzes your codebase and generates minimal, safe changes that follow
                    your existing patterns.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white text-xl font-bold">
                    3
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Review & Deploy</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Test in a preview environment, approve the changes, and deploy to production
                    with one click.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} MOAA. Built with AI, for AI-assisted development.
          </p>
        </div>
      </footer>
    </div>
  );
}
