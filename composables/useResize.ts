import { ref, onMounted, onUnmounted } from 'vue';
import debounce from '@/utils/debounce';

interface UseResizeOptions {
  el: Ref<HTMLElement | null>;
  onResize: (size: { width: number; height: number }) => void;
  debounceTime?: number;
  checkWindowResize?: boolean;
}

export function useResize({
  el,
  onResize,
  debounceTime = 100,
  checkWindowResize = false,
}: UseResizeOptions) {
  const size = ref({ width: 0, height: 0 });
  let observer: ResizeObserver | null = null;
  const debouncedOnResize = debounce(onResize, debounceTime);

  const handleResize = () => {
    if (el.value) {
      size.value.width = el.value.offsetWidth;
      size.value.height = el.value.offsetHeight;
      debouncedOnResize(size.value);
    }
  };
  const observe = (element: HTMLElement) => {
    observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        handleResize();
      }
    });
    observer.observe(element);
  };

  const unobserve = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (checkWindowResize) {
      window.removeEventListener('resize', handleResize);
    }
  };

  onMounted(() => {
    if (!el.value) return;
    if (checkWindowResize) {
      window.addEventListener('resize', handleResize);
    } else {
      observe(el.value);
    }
  });

  onUnmounted(() => {
    unobserve();
  });

  return { size };
}
