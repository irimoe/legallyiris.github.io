<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { onMounted } from 'vue'
import SelectMenu from '@/components/SelectMenu.vue'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initializeTheme()
})
</script>

<template>
  <nav>
    <div class="left">
      <RouterLink class="nav-item" to="/home">home</RouterLink>
      <RouterLink class="nav-item" to="/writing">writing</RouterLink>
      <RouterLink class="nav-item" to="/projects">projects</RouterLink>
      <RouterLink class="nav-item" to="/uses">uses</RouterLink>
    </div>
    <div class="right">
      <SelectMenu />
    </div>
  </nav>

  <main class="pane">
    <div class="pane-item profile">
      <div class="pane-main">
        <img src="https://placehold.co/200x200" alt="profile picture" />
        <h2>hi, i'm <span class="name">tayls.</span></h2>
        <p>lorem ipsum dolor sit amet</p>

        <p>[LINKS]</p>
      </div>
    </div>
    <div class="pane-item content">
      <div class="pane-titlebar">
        {{ $route.path }}
      </div>
      <div class="pane-main">
        <RouterView />
      </div>
    </div>
  </main>

  <div class="trans-flag">
    <div class="blue"></div>
    <div class="pink"></div>
    <div class="white"></div>
    <div class="pink"></div>
    <div class="blue"></div>
  </div>
</template>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  gap: 0.25rem;
  margin-bottom: 1rem;

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
    outline: none;
    transition: 0.2s;

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

.pane {
  display: grid;
  grid-template-columns: minmax(200px, 1fr) 3fr;
  gap: 1rem;
  align-items: start;

  .pane-item {
    background: hsla(var(--crust) / 0.85);
    border: 1px solid hsla(var(--subtext1) / 0.2);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
    transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    .pane-titlebar {
      padding: 0.2rem 0.5rem;
      font-size: 0.875rem;
      font-weight: 800;
      color: hsla(var(--subtext0) / 1);
      border-bottom: 1px solid hsla(var(--subtext1) / 0.2);
    }

    .pane-main {
      padding: 0.5rem;
    }
  }
}

@media (max-width: 600px) {
  .pane {
    grid-template-columns: 1fr;
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
    .name {
      font-weight: 800;
      color: hsla(var(--text) / 1);
    }
  }

  p {
    font-size: 0.875rem;
    color: hsl(var(--subtext0));
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
