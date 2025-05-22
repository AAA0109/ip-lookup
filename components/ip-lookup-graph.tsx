"use client"

import { useCallback, useEffect, useState } from "react"
import ReactFlow, {
  type Node,
  type Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Panel,
} from "reactflow"
import dagre from "dagre"
import "reactflow/dist/style.css"

const nodeWidth = 180
const nodeHeight = 60

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = "TB") => {
  dagreGraph.setGraph({ rankdir: direction })

  dagreGraph.nodes().forEach((node) => {
    dagreGraph.removeNode(node)
  })

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  return {
    nodes: nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id)
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      }
    }),
    edges,
  }
}

interface IPLookupGraphProps {
  data: any
}

export default function IPLookupGraph({ data }: IPLookupGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [showJson, setShowJson] = useState(false)

  const createGraphElements = useCallback(() => {
    if (!data || !data.data) return { nodes: [], edges: [] }

    const ipData = data.data
    const ipAddress = ipData.ipAddress

    const parentNode: Node = {
      id: "ip",
      data: { label: `IP: ${ipAddress}` },
      position: { x: 0, y: 0 },
      type: "default",
      className: "bg-blue-100 border-2 border-blue-500 rounded-md p-2 text-center",
    }

    const childNodes: Node[] = [
      {
        id: "score",
        data: { label: `Abuse Score: ${ipData.abuseConfidenceScore}%` },
        position: { x: 0, y: 0 },
        className: "bg-red-100 border border-red-500 rounded-md p-2 text-center",
      },
      {
        id: "country",
        data: { label: `Country: ${ipData.countryCode || "Unknown"}` },
        position: { x: 0, y: 0 },
        className: "bg-green-100 border border-green-500 rounded-md p-2 text-center",
      },
      {
        id: "isp",
        data: { label: `ISP: ${ipData.isp || "Unknown"}` },
        position: { x: 0, y: 0 },
        className: "bg-purple-100 border border-purple-500 rounded-md p-2 text-center",
      },
      {
        id: "domain",
        data: { label: `Domain: ${ipData.domain || "Unknown"}` },
        position: { x: 0, y: 0 },
        className: "bg-yellow-100 border border-yellow-500 rounded-md p-2 text-center",
      },
      {
        id: "reports",
        data: { label: `Reports: ${ipData.totalReports || 0}` },
        position: { x: 0, y: 0 },
        className: "bg-orange-100 border border-orange-500 rounded-md p-2 text-center",
      },
      {
        id: "lastReport",
        data: {
          label: `Last Reported: ${ipData.lastReportedAt ? new Date(ipData.lastReportedAt).toLocaleDateString() : "Never"}`,
        },
        position: { x: 0, y: 0 },
        className: "bg-teal-100 border border-teal-500 rounded-md p-2 text-center",
      },
    ]

    const graphEdges: Edge[] = childNodes.map((node) => ({
      id: `ip-${node.id}`,
      source: "ip",
      target: node.id,
      animated: true,
      style: { stroke: "#888" },
    }))

    const allNodes = [parentNode, ...childNodes]

    return getLayoutedElements(allNodes, graphEdges)
  }, [data])

  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = createGraphElements()
    setNodes(layoutedNodes)
    setEdges(layoutedEdges)
  }, [data, createGraphElements, setNodes, setEdges])

  return (
    <div className="w-full h-[600px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        connectionMode={ConnectionMode.Loose}
        fitView
        attributionPosition="bottom-right"
      >
        <Background />
        <Controls />
        <Panel position="top-right">
          <button
            onClick={() => setShowJson(!showJson)}
            className="px-3 py-1 bg-gray-200 rounded-md text-sm hover:bg-gray-300"
          >
            {showJson ? "Hide" : "Show"} JSON
          </button>
        </Panel>
        {showJson && (
          <Panel
            position="top-left"
            className="bg-white p-2 rounded-md border shadow-md max-w-md max-h-[400px] overflow-auto"
          >
            <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
          </Panel>
        )}
      </ReactFlow>
    </div>
  )
}
