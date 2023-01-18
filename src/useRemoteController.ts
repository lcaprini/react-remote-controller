import { useEffect } from 'react';

import { KeyHandler, RemoteController } from './RemoteControllerService';

export interface UseRemoteControllerConfig<T extends Record<string, unknown>> {
  listenTo: {
    [key in keyof T]?: KeyHandler;
  };
}

export interface UseRemoteControllerResult {
  pause: () => void;
  resume: () => void;
}

const useRemoteControllerHook = <T extends Record<string, unknown>>({ listenTo }: UseRemoteControllerConfig<T>): UseRemoteControllerResult => {

  useEffect(() => {
    for (const key in listenTo) {
      RemoteController.addListener(key, listenTo[key] as KeyHandler);
    }

    return () => {
      for (const key in listenTo) {
        RemoteController.removeListener(key, listenTo[key] as KeyHandler);
      }
    };
  }, [listenTo]);

  return {
    pause: RemoteController.pause,
    resume: RemoteController.resume,
  };
};

export const useRemoteController = useRemoteControllerHook;