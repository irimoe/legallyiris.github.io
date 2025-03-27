<script setup lang="ts">
import Breadcrumb from "@/components/BreadCrumbs.vue";
import { nextTick, ref, watch } from "vue";
import { RouterView } from "vue-router";
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

watch(
	() => router.currentRoute.value,
	async () => {
		await nextTick();
		await new Promise((resolve) => setTimeout(resolve, 300));
		const main = document.querySelector(".pane-panel.content") as HTMLElement;
		if (main) {
			main.setAttribute("tabindex", "-1");
			main.focus();
		}
	},
);
</script>

<template>
  <RouterView v-slot="{ Component }">
    <transition :name="currentTransition" mode="out-in">
      <div :key="$route.path" class="pane-panel content">
        <nav class="pane-titlebar" aria-label="Breadcrumbs">
          <Breadcrumb :route="$route" />
        </nav>
        <main
          class="pane-main"
          :aria-label="`${String($route.name)} page content`"
        >
          <component :is="Component" />
        </main>
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


.pane-panel.content:focus {
  outline: 1px solid red;
}

.pane-panel.content:focus:not(:focus-visible) {
  outline: none;
}

.pane-panel.content:focus-visible {
  outline: 2px solid hsla(var(--blue) / 0.5);
  border-radius: 0.5rem;
}
</style>
