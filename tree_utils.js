function addToTree(path, fullPath) {

    var pathSegments = path.split("/");
    var currentNode = $("#js-tree").jstree("get_node", "#");

    for (var i = 0; i < pathSegments.length; i++) {

        //try to find node and use that if found
        let node = findNode(currentNode, pathSegments[i])
        if (node != null) {
            currentNode = node;
        }
        else {
            //set properties for node
            let node_data = "_";
            let icon_path = "icons/opened-folder-24.png";
            if(endsWith(pathSegments[i], "?")) icon_path = "icons/block-chain-24.png";
            if(i === pathSegments.length - 1){
                icon_path = "icons/document-24.png";
                node_data = fullPath;
            }

            //define and add node
            const newNode = {
                id: CreateGuid(),
                data: node_data,
                text: pathSegments[i],
                type: "file",
                state: "open",
                icon: icon_path
            };
            $("#js-tree").jstree('create_node', currentNode.id, newNode);
            currentNode = newNode;
        }
    }
}

function findNode(root, search_string) {

    if (root != null) {
        let children = root.children;

        if (children) {
            for (let i = 0; i < children.length; i++) {
                let node = $("#js-tree").jstree("get_node", children[i]);
                if (node.text === search_string) {
                    return node;
                }
                else {
                    let nextNode = $("#js-tree").jstree("get_node", node.id);
                    findNode(nextNode, search_string);
                }
            }
        }
    }
    return null;
}

//checks if string endsWith a given substring
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

//creates a random Guid string
function CreateGuid() {
    function _p8(s) {
        const p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

//init empty tree
$('#js-tree').jstree({
    'core': {
        'data': [],
        check_callback: true
    }
});

//tree node onclick
$('#js-tree').on("changed.jstree", function (e, data) {
    document.getElementById("tree_node_selected_input").innerHTML = $("#js-tree").jstree("get_node", data.selected).data;
});

//copy button onclick function
function copy_selected(){
    const text = document.getElementById("tree_node_selected_input").innerHTML;
    navigator.clipboard.writeText(text).then(function () {
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}
