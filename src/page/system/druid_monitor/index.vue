<template>
    <div id="app">
       <iframe id="iframeId" :src="url" frameborder="0" class="pc iframe"  scrolling="auto" width="100%" height="1000px">
    </iframe>
    </div>
</template>

<script>
export default {
    data(){
        return{
            url : 'http://localhost:8080/druid',
        }
    },
    methods: {

    }
        
}
</script>