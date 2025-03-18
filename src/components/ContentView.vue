<script setup lang="ts">
import Breadcrumb from "@/components/BreadCrumbs.vue";
import { ref, watch } from "vue";
import { RouterView, useRouter } from "vue-router";
import router from "./../router";

const currentTransition = ref("slide-right");

const getRouteIndex = (path: string) => {
	const routes = router.getRoutes();
	const flatRoutes = routes.flatMap((route) => {
		if (route.children) {
			return [route, ...route.children];
		}
		return route;
	});
	return flatRoutes.findIndex((r) => r.path === path);
};

const isChildRoute = (from: string, to: string) => {
	return to.startsWith(from) && to !== from;
};

const isParentRoute = (from: string, to: string) => {
	return from.startsWith(to) && from !== to;
};

watch(
	() => router.currentRoute.value,
	(to, from) => {
		if (!from) return;

		// @ts-expect-error ts is lying.
		if (window.navigation) {
			// @ts-expect-error ts is lying.
			const navType = window.navigation.currentEntry?.navigationType;
			if (navType === "back") {
				currentTransition.value = "slide-right";
				return;
			}
			if (navType === "forward") {
				currentTransition.value = "slide-left";
				return;
			}
		}

		if (isChildRoute(from.path, to.path)) {
			currentTransition.value = "slide-left";
			return;
		}
		if (isParentRoute(from.path, to.path)) {
			currentTransition.value = "slide-right";
			return;
		}

		const fromIndex = getRouteIndex(from.path);
		const toIndex = getRouteIndex(to.path);
		currentTransition.value =
			fromIndex < toIndex ? "slide-left" : "slide-right";
	},
	{ immediate: true },
);
</script>

<template>
  <RouterView v-slot="{ Component }">
    <transition :name="currentTransition" mode="out-in">
      <div :key="$route.path" class="pane-panel content">
        <div class="pane-titlebar">
          <Breadcrumb :route="$route" />
        </div>
        <div class="pane-main">
          <component :is="Component" />
        </div>
      </div>
    </transition>
  </RouterView>
</template>

<style scoped lang="scss">
@use '../css/_variables.scss' as *;

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all $transition;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
