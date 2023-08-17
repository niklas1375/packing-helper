declare global {
  namespace jest {
    interface Matchers<R> {
      toBeSubmitResponse(): CustomMatcherResult;
    }
  }
}

interface SubmitResponse {
  status: number;
  text: string;
  rootTaskId: string;
  oooTaskId: any;
}

function isSubmitResponse(obj: any): obj is SubmitResponse {
  return (
    "rootTaskId" in obj &&
    "status" in obj &&
    "text" in obj
  );
}

const matchers = {
  toBeSubmitResponse(received: any) {
    const pass =
      isSubmitResponse(received) &&
      received.status === 201 &&
      received.text === "Created" &&
      typeof received.rootTaskId === "string" &&
      (typeof received.oooTaskId === "string" ||
        typeof received.oooTaskId === "undefined");
    if (pass) {
      return {
        message: () =>
          `expected ${JSON.stringify(
            received
          )} not to be a successful SubmitResponse`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${JSON.stringify(
            received
          )} to be a successful SubmitResponse`,
        pass: false,
      };
    }
  },
};

const jestExpect = (global as any).expect;

if (jestExpect !== undefined) {
  jestExpect.extend(matchers);
} else {
  console.error("Couldn't find Jest's global expect.");
}

export default undefined;
