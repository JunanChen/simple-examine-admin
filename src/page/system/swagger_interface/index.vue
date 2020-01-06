<template>
    <div id="app">
       <iframe id="iframeId" :src="url" frameborder="0" class="pc iframe"  scrolling="auto" width="100%" height="1000px">
    </iframe>
    </div>
</template>

<script>
import globle from '../../../globle'
export default {
    data(){
        return{
            url : globle.baseURL + '/swagger-ui.html',
        }
    },
    methods: {

    }
        
}
</script>