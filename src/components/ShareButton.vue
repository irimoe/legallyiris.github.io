<script setup lang="ts">
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { computed, ref } from "vue";

import SelectMenu from "./SelectMenu.vue";
import Tooltip from "./ToolTip.vue";

const props = defineProps<{
	title: string;
	url: string;
}>();

const shareData = computed(() => ({
	title: props.title,
	url: props.url,
	text: `Check out "${props.title}"`,
}));

const canShare = computed(() => {
	if (!navigator.share) return false;
	return true;
});

const id = ref("share-button-" + Math.random().toString(36).substr(2, 9));
const option = ref("");

const options = [
	{ value: "copy", label: "copy link" },
	{ value: "system", label: "system share" },
	{ value: "bluesky", label: "bluesky" },
];

const share = async (option: string) => {
	switch (option) {
		case "copy":
			await navigator.clipboard.writeText(shareData.value.url);
			break;
		case "system":
			if (!canShare.value) {
				alert("This feature is not supported on your device");
				return;
			}
			await navigator.share(shareData.value);
			break;
		case "bluesky":
			window.open(
				`https://bsky.app/intent/compose?text=${encodeURIComponent(
					`Check out "${shareData.value.title}" at ${shareData.value.url}`,
				)}`,
			);
			break;
	}
};
</script>

<template>
  <Tooltip text="Share">
    <SelectMenu
      :options="options"
      v-model="option"
      :icon="faShare"
      :id="id"
      @update:model-value="share(option)"
    />
  </Tooltip>
</template>

<style scoped lang="scss">
@use '../css/_variables.scss' as *;

.share-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0.5rem;
  border-radius: 50%;
  background: hsla(var(--surface0) / 0.5);
  color: hsla(var(--text) / 1);
  border: 2px solid hsla(var(--text) / 0.1);
  cursor: pointer;
  outline: none;
  transition: $transition;

  &:hover,
  &:focus-visible {
    background: hsla(var(--surface0) / 0.7);
    border: 2px solid hsla(var(--pink) / 0.7);
  }

  &:active {
    background: hsla(var(--surface0) / 1);
    border: 2px solid hsla(var(--pink) / 0.8);
    scale: 0.95;
  }
}
</style>
