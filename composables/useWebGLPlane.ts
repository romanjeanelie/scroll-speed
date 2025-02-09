import { Plane, type Curtains } from 'curtainsjs';
import type { Uniform } from 'curtainsjs';
import { gsap } from 'gsap';
import vertex from '@/shaders/vertex.glsl';
import fragment from '@/shaders/fragment.glsl';
import { mapRange, applyClamp } from '@/components/motion/utils';
import useIsTouch from '@/composables/useIsTouch';

const animations = {
  camera: {
    target: 3,
    initial: 1,
  },
  scrollSpeed: {
    enable: {
      duration: 1.5,
      scale: {
        duration: 2,
      },
    },
    disable: {
      duration: 2,
      ease: 'expo.out(12)',
      scale: {
        duration: 1.5,
        ease: 'power2.out',
      },
    },
  },
};

interface WebGLPlaneParams {
  elRef: Ref<HTMLElement | null>;
  disable: boolean;
}

export default function useWebGLPlane({ elRef, disable }: WebGLPlaneParams) {
  const planeRef = ref<Plane | null>(null);
  const { isTouch } = useIsTouch();

  let gridContainer: Element | null = null;

  const params = {
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      uScale: {
        name: 'uScale',
        type: '1f',
        value: 1,
      },
      uScale2: {
        name: 'uScale2',
        type: '1f',
        value: 1,
      },
    } as Record<string, Uniform>,
  };

  const updatePlane = (
    newProgressInPx: number,
    newRatioProgress: number,
  ): void => {
    if (!elRef.value || !planeRef.value) return;

    const imgHeight = elRef.value.clientHeight;
    const enable = gsap.utils.mapRange(
      animations.camera.initial,
      animations.camera.target,
      1,
      0,
      planeRef.value?.camera.position.z || animations.camera.initial,
    );
    const easedProgress = gsap.parseEase('power2.out')(newRatioProgress);

    const transformations = {
      translateY: { from: -0.5, to: 0, start: 0, end: 1 },
      rotateX: { from: -40 / imgHeight, to: 0, start: 0, end: imgHeight },
      scale: { from: 1, to: 1.04, start: 0, end: imgHeight / 2 },
      uniformScale: { from: 1, to: 1.12, start: 0, end: imgHeight * 1.8 },
    };

    const translateY =
      mapRange(transformations.translateY, easedProgress) * imgHeight;
    const scale = applyClamp(transformations.scale, newProgressInPx * enable);
    const rotateX = applyClamp(
      transformations.rotateX,
      newProgressInPx + translateY,
    );
    const scaleUniform = applyClamp(
      transformations.uniformScale,
      (newProgressInPx + translateY) * enable,
    );

    planeRef.value.relativeTranslation.y = -translateY * enable;
    planeRef.value.rotation.x = rotateX * enable;
    planeRef.value.scale.set(scale, scale, scale);
    planeRef.value.uniforms.uScale.value = scaleUniform;
  };

  function xTarget(): number {
    if (!elRef.value) return 0;
    if (!gridContainer) {
      gridContainer = elRef.value.closest('.gridContainer');
    }
    if (!gridContainer) return 0;

    const boundsImg = elRef.value.getBoundingClientRect();
    const boundsGridContainer = gridContainer.getBoundingClientRect();

    if (boundsImg.left < boundsGridContainer.width / 3) {
      const target =
        boundsGridContainer.left -
        boundsGridContainer.width / animations.camera.target;
      return -(boundsImg.left - target);
    } else {
      const target =
        boundsGridContainer.right +
        boundsGridContainer.width / animations.camera.target;
      return target - boundsImg.right;
    }
  }

  function onSpeedEnabled(): void {
    if (!planeRef.value) return;
    const config = {
      duration: animations.scrollSpeed.enable.duration,
    };

    gsap.killTweensOf([
      planeRef.value.camera.position,
      planeRef.value.rotation,
      planeRef.value.relativeTranslation,
      planeRef.value.uniforms.uScale2,
    ]);

    gsap.to(planeRef.value.rotation, {
      x: 0,
      ...config,
    });
    gsap.to(planeRef.value.camera.position, {
      z: animations.camera.target,
      ...config,
    });
    gsap.to(planeRef.value.relativeTranslation, {
      x: xTarget(),
      ...config,
    });
    gsap.to(planeRef.value.uniforms.uScale2, {
      value: 2,
      ...config,
      duration: 2,
    });
  }

  function onSpeedDisabled(): void {
    if (!planeRef.value) return;
    gsap.killTweensOf([
      planeRef.value.camera.position,
      planeRef.value.rotation,
      planeRef.value.relativeTranslation,
      planeRef.value.uniforms.uScale2,
    ]);

    const config = {
      ease: animations.scrollSpeed.disable.ease,
      duration: animations.scrollSpeed.disable.duration,
    };
    gsap.to(planeRef.value.camera.position, {
      z: animations.camera.initial,
      ...config,
      onUpdate: () => {
        planeRef.value?.updatePosition();
      },
    });

    gsap.to(planeRef.value.relativeTranslation, {
      x: 0,
      ...config,
    });

    gsap.to(planeRef.value.uniforms.uScale2, {
      value: 1,
      ...config,
      duration: animations.scrollSpeed.disable.scale.duration,
      ease: animations.scrollSpeed.disable.scale.ease,
    });
  }

  onMounted(async () => {
    if (disable || isTouch.value) return;
    try {
      await nextTick();
      const curtains = useNuxtApp().$curtains as Curtains;

      if (!elRef.value) {
        throw new Error('Element reference is not available');
      }

      planeRef.value = new Plane(curtains, elRef.value, params);
      planeRef.value.transformOrigin.y = 0;
    } catch (error) {
      console.error('Error initializing WebGL plane:', error);
    }
  });

  onUnmounted(() => {
    if (planeRef.value) {
      planeRef.value.remove();
      planeRef.value = null;
    }
  });

  return {
    planeRef,
    updatePlane,
    onSpeedEnabled,
    onSpeedDisabled,
  };
}
