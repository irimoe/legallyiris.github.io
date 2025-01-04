<script setup lang="ts"></script>

<template>
  <main>
    <h2>lorem ipsum dolor sit amet</h2>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec enim in diam efficitur
      lacinia. Nulla facilisi. Donec velit felis, ultricies sit amet odio nec, aliquet molestie
      enim. Nulla facilisi. In hac habitasse platea dictumst. Integer id aliquet nisi.
    </p>
    <p>
      Proin ac mi velit. Donec euismod, arcu ut consectetur tincidunt, diam sem dapibus dui, eget
      molestie elit enim eget quam. Sed eget dui a elit congue tristique. Cras euismod mauris sed
      felis tristique, ac pellentesque nisi ultrices. Donec fermentum lacus eu justo aliquam, at
      suscipit nibh maximus.
    </p>
  </main>
</template>

<style scoped>
main {
  h1,
  h2 {
    color: hsla(var(--text) / 1);
    font-weight: 900;
  }

  p {
    color: hsla(var(--text) / 0.9);
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 0.5rem;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
