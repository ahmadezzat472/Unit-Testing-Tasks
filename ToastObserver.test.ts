import { ToastService } from "./ToastObserver";

describe("ToastService", () => {
  let toastService: ToastService;
  beforeEach(() => {
    toastService = new ToastService();
  });

  test("should notify observers when a toast is shown", () => {
    const mockObserver = {
      update: jest.fn(),
    };
    toastService.subscribe(mockObserver);
    toastService.show("Test message", "info");
    expect(mockObserver.update).toHaveBeenCalled();
  });

  test("should unsubscribe observers correctly", () => {
    const mockObserver = {
      update: jest.fn(),
    };
    toastService.subscribe(mockObserver);
    toastService.unSubscribe(mockObserver);
    toastService.show("Test message", "info");
    expect(mockObserver.update).not.toHaveBeenCalled();
  });

  test("should create a toast with the correct properties", () => {
    const mockObserver = {
      update: jest.fn(),
    };
    toastService.subscribe(mockObserver);
    toastService.show("Test message", "info");
    expect(mockObserver.update).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Test message",
        type: "info",
        duration: expect.any(Number),
        id: expect.any(String),
      }),
    );
  });
});
