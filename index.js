// Returns true if there is a path from source to sink in
// residual graph. Also fills parent[] to store the path 
function bfs(rGraph, s, t, parent) {
    let visited = new Array(vertices).fill(false);

    let queue = [];
    queue.push(s);
    visited[s] = true;
    parent[s] = -1;

    while (queue.length > 0) {
        let u = queue.shift();
        for (let v = 0; v < vertices; v++) {
            if (visited[v] == false && rGraph[u][v] > 0) {
                queue.push(v);
                parent[v] = u;
                visited[v] = true;
            }
        }
    }
    // If we reached sink in BFS starting from source, then return
    // true, else false
    return (visited[t] == true);
}

// Returns tne maximum number of edge-disjoint paths from s to t.
// Ford Fulkerson
function findDisjointPaths(graph, s, t) {
    let u, v;
    // Create a residual graph and fill the residual graph with
    // given capacities in the original graph as residual capacities
    // in residual graph
    let rGraph = new Array(vertices).fill(0).map(() => new Array(vertices).fill(0)); // Residual graph where rGraph[i][j] indicates
    // residual capacity of edge from i to j (if there
    // is an edge. If rGraph[i][j] is 0, then there is not)
    for (u = 0; u < vertices; u++)
        for (v = 0; v < vertices; v++)
            rGraph[u][v] = graph[u][v];

    let parent = new Array(vertices); // This array is filled by BFS and to store path

    let max_flow = 0;
    // Augment the flow while there is path from source to sink
    while (bfs(rGraph, s, t, parent)) {

        // Find minimum residual capacity of the edges along the path filled by BFS.
        // Or we can say find the maximum flow through the path found.
        let path_flow = Number.MAX_VALUE;
        for (v = t; v != s; v = parent[v]) {
            u = parent[v];
            path_flow = Math.min(path_flow, rGraph[u][v]);
        }

        // update residual capacities of the edges and reverse edges
        for (v = t; v != s; v = parent[v]) {
            u = parent[v];
            rGraph[u][v] -= path_flow;
            rGraph[v][u] += path_flow;
        }

        // Add path flow to overall flow
        max_flow += path_flow;
    }

    // max_flow is equal to maximum number of edge-disjoint paths
    return max_flow;
}


let graph = [
    [0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 0, 0, 1],
    [0, 1, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

let vertices = graph.length
let s = 0;
let t = 7;
let maxPaths = findDisjointPaths(graph, s, t)
console.log("There can be maximum " + maxPaths + " edge-disjoint paths from " + s + " to " + t)
