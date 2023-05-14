import EventEmitter from "events";

enum ChunkEvents {
  ChunkArrives,
  ChunkProcessed,
  ChunkError,
  ChunkDeleted,
}

enum DatabaseEvents {
  DatabaseConnected,
  DatabaseDisconnected,
  DatabaseError,
  DataSaved
}

class EventDriver {
  private static event_driver: EventEmitter;

  public static init() {
    if (this.event_driver) {
      return this.event_driver;
    }

    this.event_driver = new EventEmitter();

    process.nextTick(() => {
      this.event_driver.emit("Ready");
    })

    return this.event_driver;
  }

  public static emit(event: string) {
    if (process.send) process.send(event);
    // this.event_driver.emit(event);
  }

  public static addListener(eventName: string, cb: (event: Event) => void) {
    this.event_driver.addListener(eventName, cb)
  }

  public static removeListener(eventName: string, cb: (event: Event) => void) {
    this.event_driver.removeListener(eventName, cb)
  }
}

const driver = EventDriver.init();
export {
  driver
};