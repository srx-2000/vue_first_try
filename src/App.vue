<template>
  <div id="app" style="max-width: 3000px;margin: 20px">
    <!--    <div style="margin: auto">-->
    <div>

    </div>
    <div class="row" style="margin: 20px">
      <div class="col-md-offset-2 col-md">
        <div class="page-header" style="background-color: #000000">
          <el-image src="static/logo.jpg" style="width: 160px;margin: 20px"/>
        </div>
      </div>
    </div>
    <div class="row" style="margin-left: 20px">
      <div class="col-md-2 col-md-offset-2">
        <div class="list-group">
          <router-link to="/todo" class="list-group-item ">创建任务</router-link>
          <router-link to="/search" class="list-group-item">搜索</router-link>
        </div>
      </div>

      <div class="col-md-6">
        <div class="panel">
          <div class="panel-body">
            <!--                <div><h2>about组件</h2>-->
            <router-view></router-view>
            <!--                    <p>数据</p> <input type="text"></input>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import carousel from "./components/imageTurn/imageTurn";
  import todoForm from "./pages/todoForm";
  import 'bootstrap/dist/css/bootstrap.min.css'
  import 'bootstrap/dist/js/bootstrap.min.js'

  export default {
    name: 'App',
    data() {
      return {}
    },
    components: {
      carousel,
      todoForm,
    }
  }
</script>

<style>
  #form {
    margin-top: 20px;
  }

  #imageTurn {
    margin-left: 100px;
    margin-right: 100px;
    margin-top: 10px;
  }
  .router-link-active{
    background-color: #0984e3 !important;
    color: white !important;
  }
  .list-group-item{
    color: #7f7f7f;
  }
</style>
