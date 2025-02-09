import breakpoints from '@/styles/variables/_breakpoints.module.scss';

export default function useMediaQuery() {
  const isMobile = ref(false);
  const isTablet = ref(false);
  const isDesktop = ref(false);
  const isLarge = ref(false);

  let mediaQueryLists: Record<string, MediaQueryList> = {};

  const updateMatches = () => {
    isMobile.value = window.matchMedia(
      `(max-width: ${parseInt(breakpoints.tablet) - 1}px)`,
    ).matches;
    isTablet.value = window.matchMedia(
      `(min-width: ${breakpoints.tablet}px) and (max-width: ${
        parseInt(breakpoints.desktop) - 1
      }px)`,
    ).matches;
    isDesktop.value = window.matchMedia(
      `(min-width: ${breakpoints.desktop}px) and (max-width: ${
        parseInt(breakpoints.large) - 1
      }px)`,
    ).matches;
    isLarge.value = window.matchMedia(
      `(min-width: ${breakpoints.large}px)`,
    ).matches;
  };

  onMounted(() => {
    mediaQueryLists = {
      mobile: window.matchMedia(
        `(max-width: ${parseInt(breakpoints.tablet) - 1}px)`,
      ),
      tablet: window.matchMedia(
        `(min-width: ${breakpoints.tablet}px) and (max-width: ${
          parseInt(breakpoints.desktop) - 1
        }px)`,
      ),
      desktop: window.matchMedia(
        `(min-width: ${breakpoints.desktop}px) and (max-width: ${
          parseInt(breakpoints.large) - 1
        }px)`,
      ),
      large: window.matchMedia(`(min-width: ${breakpoints.large}px)`),
    };

    for (const key in mediaQueryLists) {
      mediaQueryLists[key].addEventListener('change', updateMatches);
    }

    updateMatches();
  });

  onBeforeUnmount(() => {
    for (const key in mediaQueryLists) {
      mediaQueryLists[key].removeEventListener('change', updateMatches);
    }
  });

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLarge,
  };
}
