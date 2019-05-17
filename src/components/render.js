
// 判断是否叶子节点
const isLeaf = (data, prop) => {
    
    return !(Array.isArray(data[prop]) && data[prop].length > 0)
}



// 创建展开折叠按钮
export const renderBtn = (h, data, context) => {
    const {props} = context
    const expandHandler = context.listeners['on-expand']

    let cls = ['org-tree-node-btn']

    if (context.parent[props.expand]) {
        cls.push('expanded')
    }
    return h('span', {
        domProps: {
            className: cls.join(' ')
        },
        on: {
            click: e => {
                e.stopPropagation()
                expandHandler && expandHandler(data)
            }
        }
    })
}





export const render = (h, context) => {
    const {props} = context
    return renderNode(h, props.data, context)
}


export const renderNode = (h, data, context) => {
    
    const props = data
    const cls = ['org-tree-node']
    const childNodes = []
    if (isLeaf(data, props.children)) {
        cls.push('is-leaf')
    } else if (context.parent.collapsable && !context.parent[props.expand] ) {
        cls.push('collapsed')
    }
    childNodes.push(renderLabel(h, data, context))
    if (props.children && props.children.length) {
        childNodes.push(renderChildren(h, props.children, context))
    }
    return h('div', {
        domProps: {
            className: 'org-tree-node'
        }
    }, childNodes)
}

  
export const renderLabel = (h, data, context) => {
    const props = data
    const renderContent = context.parent.renderContent
    const childNodes = []
    const clickHandler = context.listeners['on-node-click']
    // 节点label定制，由调用者传入的renderContent实现
    if (typeof renderContent === 'function') {
      let vnode = renderContent(h, props)
  
      vnode && childNodes.push(vnode)
    } else {
      childNodes.push(props.name)
    }
    if (context.parent.collapsable && !isLeaf(data, props.children)) {
        childNodes.push(renderBtn(h, data, context))
    }

    const cls = ['org-tree-node-label-inner']
    let labelWidth = context.parent.labelWidth
    let labelClassName = context.parent.labelClassName
    if (typeof labelWidth === 'number') {
        labelWidth += 'px'
    }
    if (typeof labelClassName === 'function') {
        labelClassName = labelClassName(data)
    }
    labelClassName && cls.push(labelClassName)
    return h('div', {
      domProps: {
        className: 'org-tree-node-label'
      }
    },[h('div', {
        domProps: {
            className: cls.join(' ')
        },
        style: {width: labelWidth},
        on: {
            click: e => clickHandler && clickHandler(e, data)
        }
    }, childNodes)])
}


export const renderChildren = (h, list, context) => {

    if (Array.isArray(list) && list.length > 0) {
      const children = list.map(item => {
        return renderNode(h, item, context)
      })
  
      return h('div', {
        domProps: {
          className: 'org-tree-node-children'
        }
      }, children)
    }else{
        return ''
    }
    
}
  
export default render
  