<template>
    <div>
        <h1 class="title">Request Rocket</h1>
        <div>
            <request-editor></request-editor>
            <response-inspector></response-inspector>
        </div>
    </div>
</template>

<script>
  import RequestEditor from './request-editor';
  import ResponseInspector from './response-inspector';

  export default {
    name: 'main-window',
    components: { RequestEditor, ResponseInspector },
  };</script>

<style>
</style>
