<script setup lang="ts">
import {
	type IconDefinition,
	faBluesky,
	faGitAlt,
	faGithub,
	faLastfm,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { RouterLink } from "vue-router";

import { buildInfo } from "@/buildInfo";
import ContentView from "@/components/ContentView.vue";
import ThemeSelector from "@/components/ThemeSelector.vue";
import Tooltip from "@/components/ToolTip.vue";
import router from "@/router";

type Link =
	| {
			name: string;
			href: string;
			isLocal?: false | undefined;
			icon: IconDefinition;
	  }
	| {
			name: string;
			href: string;
			isLocal: true;
			icon: string;
	  };

const links: Link[] = [
	{
		name: "github",
		href: "https://github.com/legallyiris",
		icon: faGithub,
	},
	{
		name: "git.gay",
		href: "https://git.gay/iris",
		icon: faGitAlt,
	},
	{
		name: "bluesky",
		href: "https://bsky.app/profile/legallyiris.dev",
		icon: faBluesky,
	},
	{
		name: "listenbrainz",
		href: "https://listenbrainz.org/user/legallyiris/",
		icon: faLastfm,
	},
];

const formattedDate = new Date(buildInfo.buildTime).toLocaleDateString(
	"en-US",
	{
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	},
);

function scrollToMainContent() {
	const mainHeading = document.querySelector(
		".pane-panel.content h1",
	) as HTMLElement;
	if (mainHeading) {
		mainHeading.setAttribute("tabindex", "-1");
		mainHeading.focus();
	}
}
</script>

<template>

  <nav aria-label="Skip to main content" class="skip-to-main">
    <button class="nav-item" @click="scrollToMainContent">
      Skip to main content
    </button>
  </nav>

  <nav class="main-nav">
    <div class="left">
      <RouterLink
        v-for="route in router.getRoutes().filter((route) => route.meta.nav)"
        :key="route.path"
        class="nav-item"
        :to="route.path"
      >
        {{ route.name }}
      </RouterLink>
    </div>
    <div class="right">
      <ThemeSelector />
    </div>
  </nav>

  <div class="pane main-pane">
    <aside class="pane-item vertical profile">
      <div class="pane-panel pane-main">
        <img src="/me.webp" alt="profile picture" />
        <h2>hi, i'm <span class="name">iris.</span></h2>
        <div class="pronouns">it/its/itself</div>

        <p>
          silly web developer & enjoyer of cattpuccin, the best colour scheme. i like making things
          that look nice and feel good to use.
        </p>

        <div class="links">
          <Tooltip v-for="link in links" :key="link.name" :text="link.name">
            <template #default="{ show, hide }">
              <a
                :href="link.href"
                :aria-label="link.name"
                target="_blank"
                rel="noopener noreferrer"
                @mouseenter="show"
                @mouseleave="hide"
                @focus="show"
                @blur="hide"
              >
                <FontAwesomeIcon :icon="link.icon" v-if="!link.isLocal" />
                <div v-if="link.isLocal" class="icon" v-html="link.icon" aria-hidden="true" />
              </a>
            </template>
          </Tooltip>
        </div>
      </div>
      <div class="pane-panel pane-main footer-info">
        <div>made with meows</div>
        <div class="build-info">
          <span>commit: <a :href="`https://github.com/legallyiris/legallyiris.github.io/commit/${buildInfo.commitHash}`" target="_blank" rel="noopener">{{ buildInfo.commitHash.substring(0, 7) }}</a></span>
          <span>built: {{ formattedDate }}</span>
        </div>
      </div>
    </aside>
    <ContentView />
  </div>

  <div class="trans-flag">
    <div class="blue"></div>
    <div class="pink"></div>
    <div class="white"></div>
    <div class="pink"></div>
    <div class="blue"></div>
  </div>
</template>

<style scoped lang="scss">
@use 'css/_variables.scss' as *;

nav.main-nav {
  position: fixed;
  display: flex;
  justify-content: space-between;
  width: calc(100% - 2rem);
  gap: 0.25rem;
  z-index: 500;

  .left,
  .right {
    display: flex;
    gap: 0.25rem;
  }

  .nav-item {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    border-radius: 50rem;
    color: var(--text);
    text-decoration: none;
    background: hsla(var(--surface0) / 0.5);
    border: 2px solid hsla(var(--text) / 0.2);
    backdrop-filter: blur(10px);
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

    &.router-link-active {
      background: hsla(var(--surface0) / 0.8);
      border: 2px solid hsla(var(--flamingo) / 0.8);
      &:hover,
      &:focus-visible {
        background: hsla(var(--surface0) / 0.5);
        border: 2px solid hsla(var(--flamingo) / 1);
      }
      &:active {
        background: hsla(var(--surface1) / 1);
        border: 2px solid hsla(var(--flamingo) / 1);
      }
    }
  }
}

.skip-to-main {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  text-align: center;

  button {
    position: absolute;
    top: -100px;
    left: 50%;
    transform: translateX(-50%);

    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    background: hsla(var(--surface0) / 0.9);
    color: hsl(var(--text));
    border: 2px solid hsla(var(--blue) / 0.8);
    border-radius: 0 0 0.5rem 0.5rem;
    font-weight: bold;
    cursor: pointer;

    &:focus {
      top: 0;
      outline: none;
      box-shadow: 0 0 0 2px hsla(var(--blue) / 0.5);
    }
  }
}

.main-pane {
  margin-top: 3rem;
  margin-bottom: 1rem;
}

.links {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  margin-top: 0.5rem;

  a {
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    padding: 0.5rem;
    width: 2rem;
    height: 2rem;

    border-radius: 50%;
    background: hsla(var(--surface0) / 0.5);
    color: hsla(var(--text) / 1);
    border: 2px solid hsla(var(--text) / 0.1);
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
}

.profile {
  display: flex;
  flex-direction: column;
  color: hsl(var(--subtext0));

  img {
    border-radius: 0.5rem;
    width: 6rem;
    height: 6rem;
  }

  h2 {
    font-size: 1.75rem;
    margin: 0;
    margin-block-end: 0;
    .name {
      font-weight: 800;
      color: hsla(var(--text) / 1);
    }
  }

  .pronouns {
    font-size: 0.75rem;
    color: hsla(var(--subtext0) / 0.8);
  }

  p {
    font-size: 0.875rem;
    color: hsl(var(--subtext0));
  }
}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.7rem;
  color: hsla(var(--subtext0) / 0.7);

  .build-info {
    display: flex;
    flex-direction: column;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;

    a {
      color: hsla(var(--blue) / 0.8);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
        color: hsla(var(--blue) / 1);
      }
    }
  }
}

.trans-flag {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  border-top: 1px solid hsla(var(--subtext1) / 1);

  div {
    height: 1rem;
    flex: 1;
  }

  .blue {
    background: #5bcefa;
  }

  .pink {
    background: #f5a2b8;
  }

  .white {
    background: #fff;
  }
}
</style>
