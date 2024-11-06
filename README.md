# sbqa-performance-test

## Installation & Configuration

### Prerequisites
<h4>1. Install Node.js</h4>
Ensure you have Node.js installed, as it may be used for additional dependencies or scripts. Download it here: [Node.js Download](https://nodejs.org/en)

<h4>2. Install k6</h4>
You can install k6 using Homebrew (macOS), Chocolatey (Windows), or download it directly.

On macOS: 
```bash
brew install k6
```
On Windows:
```bash
choco install k6
```

<h4>3. Install `dotenv-cli`</h4>
To load environment variables before running your K6 script.
```bash
npm install -g dotenv-cli
```


### Installation
Setup `sbqa-performance-test` test-suites by cloning from github repository

```bash
git clone git@github.com:rochabey/sbqa-performance-test.git
```

Install project dependent packages
```bash
npm install
```

### Configuration

<h4>Environment Variables:</h4>
If your test scripts require environment variables, create a .env file in the root directory and add your variables there.
<h4>k6 Options:</h4>
You can configure options like duration and virtual users in each k6 test script or directly in the CLI


### Running Tests

To run the performance script
```bash
npm run run:perf
```

## Related Links

[sbqa-performance-test](https://github.com/rochabey/sbqa-performance-test.git)

[Node.js Download](https://nodejs.org/en)

[Grafana k6 Documentation](https://grafana.com/docs/k6/latest/)