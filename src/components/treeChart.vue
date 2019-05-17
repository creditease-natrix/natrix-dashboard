
<template>
    <div id="org-tree-container" ref="orgTreeContainer">
    </div>

</template>
<script>
import * as d3 from "d3"
export default {
    name: "treeChart",
    props: {
        // TODO: validate props
        // The data structure
        tree_data: {
            type: [Object],
            required: true,
            default:{}
        },
        parentWidth:{
            type:[Number],
            required:true,
        },
        node_option: {
            type: Object,
            default: () => ({
                events: []
            })
        },
        cells_option: {
            type: Array,
            default: () => ([
                {
                    dom_class: function(d){
                        return 'normal'
                    },
                    get_text: function(d){
                        if(d.name){
                            return d.name
                        }else{
                            return ''
                        }
                    },
                    events: []
                }
            ])           
        }
    },
    data () {
        return {
            // The chart panel settings
            width: 500,
            height: 500,
            chart_margin: {
                top: 20,
                bottom: 20,
                left: 0,
                right: 50,
            },

            // Tree node settings
            node_height: 100,
            node_width: 180,
            cell_height: 25,
            cell_margin: {
                top: 5,
                left: 10,
                right: 10
            },
            
        }

    },
    mounted () {
        this.drawChart()
    },
    watch:{
        tree_data: {
            handler: function(newval, oldval){
                this.eraseChart()
                this.drawChart()
            },
            deep: true
        },
        parentWidth:{
            handler:function(newval,oldval){
            },
            immediate: true

        }
        


    },
    methods: {
        /**
         * Calculate the tree layout attributes
         * 
         * Tree Chart Attribute:
         *  - width
         *  - height
         *  - node_width
         *  - 
         * 
         */
        tree_layout_set(root){
            let nodes = root.descendants()
            // calculate the height of tree chart.
            let leaves_count = root.leaves().length
            this.height = this.node_height * leaves_count

            // calculate the width of tree chart
            let lowest_leave = nodes.reduce(function(pre, curr){
                return pre.depth > curr.depth ? pre: curr;
            })
            let tree_height  = lowest_leave.depth + 1
            // The standard_width depends on node_width
            let standard_width = this.node_width * 2 * tree_height
            let max_width = this.$refs.orgTreeContainer.parentNode.clientWidth
            let tree_width = 0
            if (standard_width > max_width){
                this.node_width = max_width / (tree_height * 2)
                tree_width = max_width
            }else{
                tree_width = standard_width
            }
            this.width = tree_width
        },

        /**
         * Draw the tree.
         *  
         */
        drawChart(){
            if (this.tree_data == null){
                return
            }
            let that = this;
            let root = d3.hierarchy(this.tree_data, function (d) {
                return d.children;
            });
            
            this.tree_layout_set(root)

            let svg = d3.select("#org-tree-container")
                      .append("svg")
                      .attr("width", this.width)
                      .attr("height", this.height)
                      .attr("transform", `translate(${this.chart_margin.left}, ${this.chart_margin.top})`)
                     
            let g = svg.append("g")
                    .attr("class", "root")
                    // .attr("transform", `translate(${this.chart_margin.left}, ${this.chart_margin.top})`)

            let tree = d3.tree()
                .size([this.height, this.width - this.node_width])
            let treeData = tree(root)

            const node = g.append("g")
                .selectAll("g")
                .data(treeData.descendants())
                .join("g")
                .attr("class", "node")
                .attr("transform", d => `translate(${d.y},${d.x})`)
                .attr("cursor",'pointer')
            
            this.node_option.events.forEach(function(d){
                node.on(d.type, n => d.handler(n.data))
            })
            
            this.cells_option.forEach(function(option, index){
                let rect_node = node.append("g")
                    .attr("class", d => option.dom_class(d.data))

                // add rectangele
                rect_node.append("rect")
                    .attr("width", that.node_width)
                    .attr("height", that.cell_height)
                    .attr("x", 0)
                    .attr("y", that.cell_height/2 * -1 + index * that.cell_height)

                // add text in rectangle
                rect_node.append("text")
                    .attr("width", that.node_width)
                    .attr("height", that.cell_height)
                    .attr("x", that.cell_margin.left)
                    .attr("y", that.cell_margin.top + index * that.cell_height)
                    .text(function(d){
                        let context = option.get_text(d.data)
                        if(!context){
                            return d3.select(this).remove()
                        }else{
                            return context
                        }
                    })
                    .each( function (){
                        let textdom = d3.select(this)
                        that.textDisplay(textdom)
                    })
            })
            const text = d3.selectAll("text").attr("fill",'#fff')
            // link nodes in the tree
            const link = g.append("g")
                .attr("fill", "none")
                .attr("stroke", "#F7881F")
                .attr("stroke-opacity", 0.4)
                .attr("stroke-width", 1.5)
                .selectAll("path")
                .data(root.links())
                .join("path")
                .attr("d", d => this.pathCaculate(d.source, d.target));
        
        },
        /**
         * Caculate the link path in SVG format
         */
        pathCaculate(s, d){
            let path = null;
            if (d) {
                path = `M ${s.y  + this.node_width} ${s.x}
							L ${s.y + (d.y - s.y + this.node_width)/2 } ${s.x}
							L ${s.y + (d.y - s.y + this.node_width)/2 } ${d.x}
							L ${d.y} ${d.x}
					`
            }
            return path
        },
        /**
         * Omit the part of text which is extend dom.
         * 
         */
        textDisplay(textdom, width=this.node_width){
            let text_length = textdom.node().getComputedTextLength(),
                text = textdom.text();
            
            while (text_length > width && text.length > 0){
                text = text.slice(0, -3)
                textdom.text(text + '...')
                text_length = textdom.node().getComputedTextLength()
            }

        },
        
        eraseChart(){
            d3.select('svg').remove()
        },
        
        

    }

}

</script>

<style>
#org-tree-container {
    background-color: #fff;
    height:100%;
}
.node .unknown  rect{
    stroke-width: 1px;
    fill: #c0c4cc;
}
.node .normal rect{
    stroke-width: 1px;
    fill: #dcdfe6;
}

.node .danger rect {
    stroke-width: 1px;
    fill: #F56C6C;
}

.node .fine rect {
    stroke-width: 1px;
    fill: #67C23A;
    stroke: #c0c4cc;
}

.node .danger text {
    font-size: 16px;
}
.node text{
 fill:#444;
}
</style>
