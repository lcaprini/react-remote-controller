type KeyMap = { [key: string]: number[] };

export type KeyHandler = () => void;

type KeyHandlersMap = {
  [key: string]: KeyHandler[];
};

type InitConfig = {
  debug?: boolean;
  throttle?: number;
};

class RemoteControllerService {
  /**
   * Flag used to print additional infos during the process
   */
  private debug: boolean;

  /**
   * Flag used to block key events from this service
   */
  private paused: boolean;

  /**
   * List of all KeyMap defined by user
   */
  private keyMap: KeyMap;
  private keyHandlersMap: KeyHandlersMap;

  private keyDownEventListener?: (event: KeyboardEvent) => void;

  constructor() {
    this.debug = false;
    this.paused = false;
    this.keyMap = {};
    this.keyHandlersMap = {};

    this.init = this.init.bind(this);
    this.destroy = this.destroy.bind(this);
    this.setKeyMap = this.setKeyMap.bind(this);
    this.pause = this.pause.bind(this);
    this.resume = this.resume.bind(this);
  }

  public init({ debug = false }: InitConfig): void {
    this.debug = debug;
    this.bindEventHandler();
  }

  public destroy(): void {
    this.unbindEventHandler();
  }

  private bindEventHandler(): void {
    if (typeof window !== 'undefined' && window.addEventListener) {
      this.keyDownEventListener = (event: KeyboardEvent): void => {
        if (this.paused === true) {
          return;
        }

        this.log('keyDownHandler', `key ${event.keyCode} pressed`);

        const buttonName = this.getButtonnameFromKeyCode(event.keyCode);

        if (!buttonName) {
          this.log('keyDownHandler', 'button not mapped');
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (this.keyHandlersMap[buttonName].length > 0) {
          this.log('keyDownHandler', `exec action for button ${buttonName}`);
          this.keyHandlersMap[buttonName].forEach(callback => callback());
        }
        else {
          this.log('keyDownHandler', `no actions for button ${buttonName}`);
        }
      };

      window.addEventListener('keydown', this.keyDownEventListener);
    }
  }

  private unbindEventHandler(): void {
    if (typeof window !== 'undefined' && window.removeEventListener) {
      if (this.keyDownEventListener) {
        window.removeEventListener('keydown', this.keyDownEventListener);
        this.keyDownEventListener = undefined;
      }
    }
  }

  public setKeyMap(keyMap: { [key: string]: number | number[] }): void {
    for (const key in keyMap) {
      const value = keyMap[key];
      if (typeof value === 'number') {
        this.keyMap[key] = [value];
      }
      else if (Array.isArray(value)) {
        this.keyMap[key] = value;
      }
    }
    this.log('setKeyMap', 'keyMap:', this.keyMap);
    for (const key in this.keyMap) {
      if (!this.keyHandlersMap[key]) {
        this.keyHandlersMap[key] = [];
      }
    }
    this.log('setKeyMap', 'keyHandlersMap:', this.keyHandlersMap);
  }

  private getButtonnameFromKeyCode(keyCode: number): string | undefined {
    for (const key in this.keyMap) {
      if (this.keyMap[key].includes(keyCode)) {
        return key;
      }
    }
    return;
  }

  public pause(): void {
    this.paused = true;
  }

  public resume(): void {
    this.paused = false;
  }

  public addListener(key: string, callback: KeyHandler): void {
    if (!this.keyHandlersMap[key]) {
      return;
    }
    this.keyHandlersMap[key].push(callback);
    this.log('addListener', `keyHandlersMap for ${key}:`, this.keyHandlersMap[key]);
  }

  public removeListener(key: string, callback: KeyHandler): void {
    if (this.keyHandlersMap[key]) {
      this.keyHandlersMap[key] = this.keyHandlersMap[key].filter(c => c !== callback);
      this.log('removeListener', `keyHandlersMap for ${key}:`, this.keyHandlersMap[key]);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private log(functionName: string, debugString: string, ...rest: any[]): void {
    if (this.debug) {
      console.log(
        `%c${functionName}%c${debugString}`,
        'background: #0FF; color: black; padding: 1px 5px;',
        'background: #333; color: #BADA55; padding: 1px 5px;',
        ...rest,
      );
    }
  }
}

export const RemoteController = new RemoteControllerService();

export const { init, setKeyMap } = RemoteController;
