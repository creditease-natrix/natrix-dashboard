<template>
    <footer class="main-footer">
            <div class="pull-right hidden-xs">
                <b>Version</b> 0.1.0
            </div>
            <strong class="right">Copyright &copy; 2017-2018 <a href="javascript:void(0)">Natrix Group</a></strong>&nbsp;&nbsp;All rights reserved.
    </footer> 
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.main-footer{
  margin-left: 0;
  /* position: fixed;
  bottom:0;  */
  width:100%;
  padding:15px 0 15px 245px;
  
}
.right{
  font-weight:bold;
}
</style>
