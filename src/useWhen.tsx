import IUseWhen from './models/IUseWhen';
import useRtrOktaAuth from './useRtrOktaAuth';

function useWhen(): IUseWhen {
  const { isAuthenticated } = useRtrOktaAuth().authCtx.authState;

  return {
    when,
  };

  function when(fn: () => boolean) {
    if (!isAuthenticated) return false;

    return fn();
  }
}

export default useWhen;
