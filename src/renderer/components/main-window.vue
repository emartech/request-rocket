<template>
    <div>
        <h1 class="title">Request Rocket</h1>
        <div>
            <request-editor></request-editor>
        </div>
    </div>
</template>

<script>
  import RequestEditor from './request-editor';

  export default {
    name: 'main-window',
    components: { RequestEditor },
  };
</script>

<style>
</style>
