<template>
  <div class="org-tree-container">
    <div class="org-tree" :class="{horizontal, collapsable}">
      <div class="org-tree-node">
        <div class="org-tree-node-label root">
          <slot>{{data.name}}</slot>
        </div>

        <div class="org-tree-node-children" v-if="data.children && data.children.length  > 0 ">
          <org-tree-node v-for="(node,index) in data.children" :data="node" :key="index"></org-tree-node>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import render from "./render.js";
export default {
  name: "OrgTree",
  components: {
    OrgTreeNode: {
      render,
      functional: true
    }
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    props: {
      type: Object,
      default: () => ({
        name: "",
        expand: "expand",
        children: "children"
      })
    },
    horizontal: Boolean,
    collapsable: Boolean,
    renderContent: Function,
    labelWidth: [String, Number],
    labelClassName: [Function, String]
  },
  created() {},
  methods: {}
};
</script>


<style scoped>
.root:before {
  display: none;
}
.org-tree-container {
  display: inline-block;
  padding: 15px;
  background-color: #fff;
}

.org-tree {
  /* // display: inline-block; */
  display: table;
  text-align: center;
}
.org-tree:before,
.org-tree:after {
  content: "";
  display: table;
}
.org-tree:after {
  clear: both;
}

.org-tree-node,
.org-tree-node-children {
  position: relative;
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.org-tree-node-children:before,
.org-tree-node-children:after {
  transition: all 0.35s;
}
.org-tree-node-label {
  position: relative;
  display: inline-block;
}
.org-tree-node-label .org-tree-node-label-inner {
  padding: 10px 15px;
  text-align: center;
  border-radius: 3px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
}
.org-tree-node-btn {
  position: absolute;
  top: 100%;
  left: 50%;
  width: 20px;
  height: 20px;
  z-index: 10;
  margin-left: -11px;
  margin-top: 9px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.35s ease;
}
.org-tree-node-btn:hover {
  background-color: #e7e8e9;
  transform: scale(1.15);
}

.org-tree-node-btn:before,
.org-tree-node-btn:after {
  content: "";
  position: absolute;
}

.org-tree-node-btn:before {
  top: 50%;
  left: 4px;
  right: 4px;
  height: 0;
  border-top: 1px solid #ccc;
}

.org-tree-node-btn:after {
  top: 4px;
  left: 50%;
  bottom: 4px;
  width: 0;
  border-left: 1px solid #ccc;
}

.org-tree-node-btn.expanded:after {
  border: none;
}
.org-tree-node {
  padding-top: 20px;
}
/* .org-tree-node:not(:only-child) {
  float: left;
} */

.org-tree-node .is-leaf,
.org-tree-node .collapsed {
  padding-left: 10px;
  padding-right: 10px;
}

.org-tree-node:before,
.org-tree-node:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 19px;
}

.org-tree-node:after {
  left: 50%;
  border-left: 1px solid #ddd;
}

.org-tree-node:not(:first-child):before,
.org-tree-node:not(:last-child):after {
  border-top: 1px solid #ddd;
}
.collapsable .org-tree-node.collapsed {
  padding-bottom: 30px;
}
.collapsable .org-tree-node.collapsed .org-tree-node-label:after {
  content: "";
  position: absolute;
  top: 100%;
  left: 0;
  width: 50%;
  height: 20px;
  border-right: 1px solid #ddd;
}
.org-tree > .org-tree-node {
  padding-top: 0;
}
.org-tree > .org-tree-node:after {
  border-left: 0;
}
.org-tree-node-children {
  padding-top: 20px;
}
.org-tree-node-children:before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: 0;
  height: 20px;
  border-left: 1px solid #ddd;
}

.org-tree-node-children:after {
  content: "";
  display: table;
  clear: both;
}

.horizontal .org-tree-node {
  /* // display: flex;
  // flex-direction: row;
  // justify-content: flex-start;
  // align-items: center; */
  display: table-cell;
  /* float: none; */
  padding-top: 0;
  padding-left: 20px;
}
.horizontal .org-tree-node.is-leaf,
.horizontal .org-tree-node.collapsed {
  padding-top: 10px;
  padding-bottom: 10px;
}

.org-tree-node:before,
.org-tree-node:after {
  width: 19px;
  height: 50%;
}

.org-tree-node:after {
  top: 50%;
  left: 0;
  border-left: 0;
}

.org-tree-node:only-child:before {
  top: 1px;
  border-bottom: 1px solid #ddd;
}
.org-tree .org-tree-node:first-child:before {
  display: none;
}
.org-tree-node:not(:first-child):before,
.org-tree-node:not(:last-child):after {
  border-top: 0;
  border-left: 1px solid #ddd;
}

.org-tree-node:not(:only-child):after {
  border-top: 1px solid #ddd;
}

.org-tree-node-inner {
  display: table;
}
.horizontal .org-tree-node-label {
  display: table-cell;
  vertical-align: middle;
  padding-top: 10px;
}

.horizontal .org-tree-node-label.collapsable .org-tree-node.collapsed {
  padding-right: 30px;
}
.horizontal .org-tree-node-label:after {
  top: 0;
  left: 100%;
  width: 20px;
  height: 50%;
  border-right: 0;
  border-bottom: 1px solid #ddd;
}
.horizontal .org-tree-node-btn {
  top: 50%;
  left: 100%;
  margin-top: -11px;
  margin-left: 9px;
}

.horizontal .org-tree-node-label > .org-tree-node:only-child:before {
  border-bottom: 0;
}

.horizontal .org-tree-node-children {
  /* // display: flex;
  // flex-direction: column;
  // justify-content: center;
  // align-items: flex-start; */
  display: table-cell;
  padding-top: 0;
  padding-left: 20px;
}
.horizontal .org-tree-node-children:before {
  top: 50%;
  left: 0;
  width: 20px;
  height: 0;
  border-left: 0;
  border-top: 1px solid #ddd;
}

.horizontal .org-tree-node-children:after {
  display: none;
}

.horizontal .org-tree-node-children > .org-tree-node {
  display: block;
}
</style>
