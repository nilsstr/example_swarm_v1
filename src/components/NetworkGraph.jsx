import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NODE_POSITIONS = {
  orchestrator: { x: 250, y: 60 },
  financial: { x: 80, y: 220 },
  competitive: { x: 220, y: 280 },
  management: { x: 350, y: 260 },
  macro: { x: 430, y: 180 },
  memory: { x: 250, y: 170 },
  userA: { x: 100, y: 300 },
  userB: { x: 250, y: 320 },
  userC: { x: 400, y: 300 },
  tracker: { x: 420, y: 120 },
  patterns: { x: 120, y: 170 },
  scorer: { x: 380, y: 250 },
}

// Steps 6-8 use a different layout to highlight memory + users
const MEMORY_POSITIONS = {
  orchestrator: { x: 250, y: 50 },
  financial: { x: 80, y: 220 },
  competitive: { x: 420, y: 140 },
  management: { x: 420, y: 260 },
  macro: { x: 80, y: 140 },
  memory: { x: 250, y: 170 },
  userA: { x: 100, y: 310 },
  userB: { x: 250, y: 330 },
  userC: { x: 400, y: 310 },
  tracker: { x: 420, y: 120 },
  patterns: { x: 120, y: 170 },
  scorer: { x: 380, y: 250 },
}

// Steps 9-12: learning loop layout — circular flywheel
const LEARNING_POSITIONS = {
  orchestrator: { x: 250, y: 40 },
  financial: { x: 120, y: 130 },
  competitive: { x: 380, y: 130 },
  management: { x: 350, y: 260 },
  macro: { x: 430, y: 180 },
  memory: { x: 250, y: 310 },
  tracker: { x: 430, y: 80 },
  patterns: { x: 80, y: 250 },
  scorer: { x: 420, y: 250 },
  userA: { x: 100, y: 310 },
  userB: { x: 250, y: 330 },
  userC: { x: 400, y: 310 },
}

function getPositions(currentStep) {
  if (currentStep >= 9) return LEARNING_POSITIONS
  if (currentStep >= 6) return MEMORY_POSITIONS
  return NODE_POSITIONS
}

export default function NetworkGraph({ agents, activeAgents, connections, currentStep, mobile }) {
  const positions = getPositions(currentStep)

  const particles = useMemo(() => {
    return connections.map((conn, i) => ({
      from: positions[conn[0]],
      to: positions[conn[1]],
      key: `${conn[0]}-${conn[1]}-${currentStep}-${i}`,
      color: agents[conn[0]]?.color || '#3b82f6',
    }))
  }, [connections, currentStep, agents, positions])

  // Determine which nodes to show
  const visibleNodes = currentStep >= 12
    ? ['orchestrator', 'tracker', 'memory', 'patterns', 'scorer']
    : currentStep >= 11
    ? ['orchestrator', 'patterns', 'scorer', 'financial']
    : currentStep >= 10
    ? ['patterns', 'memory', 'orchestrator']
    : currentStep >= 9
    ? ['orchestrator', 'tracker', 'memory']
    : currentStep >= 7
    ? ['memory', 'userA', 'userB', 'userC', 'orchestrator', 'financial', 'competitive']
    : currentStep === 6
    ? ['orchestrator', 'memory', 'financial', 'competitive', 'management', 'macro']
    : ['orchestrator', 'financial', 'competitive', 'management', 'macro']

  return (
    <div style={styles.container}>
      <div style={styles.label}>
        {currentStep >= 9 ? 'Self-Learning Agent Network' : currentStep >= 6 ? 'Agent Network + Memory Layer' : 'Agent Network'}
      </div>
      <svg
        width={mobile ? '100%' : 500}
        height={mobile ? 260 : 380}
        viewBox="0 0 500 380"
        preserveAspectRatio="xMidYMid meet"
        style={styles.svg}
      >
        <defs>
          {Object.values(agents).map(agent => (
            <radialGradient key={agent.id} id={`glow-${agent.id}`}>
              <stop offset="0%" stopColor={agent.color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={agent.color} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {/* Memory layer background (steps 6-8) */}
        {currentStep >= 6 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <rect
              x={140}
              y={140}
              width={220}
              height={70}
              rx={12}
              fill="rgba(244,114,182,0.05)"
              stroke="rgba(244,114,182,0.15)"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <text
              x={250}
              y={155}
              textAnchor="middle"
              fontSize={8}
              fill="#f472b6"
              fontFamily="Inter, sans-serif"
              fontWeight={600}
              opacity={0.6}
            >
              PERSISTENT MEMORY LAYER
            </text>
          </motion.g>
        )}

        {/* Learning loop background (steps 9-12) */}
        {currentStep >= 9 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Circular flywheel path — static background */}
            <ellipse
              cx={250}
              cy={180}
              rx={200}
              ry={140}
              fill="none"
              stroke="rgba(45,212,191,0.06)"
              strokeWidth={40}
            />
            {/* Animated rotating dash overlay */}
            <motion.ellipse
              cx={250}
              cy={180}
              rx={200}
              ry={140}
              fill="none"
              stroke="rgba(45,212,191,0.18)"
              strokeWidth={2}
              strokeDasharray="30 50"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -800 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <motion.ellipse
              cx={250}
              cy={180}
              rx={200}
              ry={140}
              fill="none"
              stroke="rgba(45,212,191,0.12)"
              strokeWidth={1.5}
              strokeDasharray="20 60"
              initial={{ strokeDashoffset: -400 }}
              animate={{ strokeDashoffset: 400 }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <text
              x={250}
              y={185}
              textAnchor="middle"
              fontSize={9}
              fill="rgba(45,212,191,0.35)"
              fontFamily="Inter, sans-serif"
              fontWeight={700}
              letterSpacing="0.15em"
            >
              LEARNING FLYWHEEL
            </text>
          </motion.g>
        )}

        {/* User profiles background (steps 7-8) */}
        {currentStep >= 7 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <rect
              x={60}
              y={270}
              width={380}
              height={90}
              rx={12}
              fill="rgba(56,189,248,0.03)"
              stroke="rgba(56,189,248,0.1)"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <text
              x={250}
              y={285}
              textAnchor="middle"
              fontSize={8}
              fill="#38bdf8"
              fontFamily="Inter, sans-serif"
              fontWeight={600}
              opacity={0.5}
            >
              USER PROFILES (ISOLATED)
            </text>
          </motion.g>
        )}

        {/* Connection lines */}
        <AnimatePresence>
          {connections.map(([from, to], i) => {
            const p1 = positions[from]
            const p2 = positions[to]
            if (!p1 || !p2) return null
            const color = agents[from]?.color || '#3b82f6'
            return (
              <motion.line
                key={`line-${from}-${to}-${currentStep}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={color}
                strokeWidth={2}
                strokeOpacity={0.3}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              />
            )
          })}
        </AnimatePresence>

        {/* Animated particles along connections */}
        {particles.map((p) => {
          if (!p.from || !p.to) return null
          return (
            <motion.circle
              key={p.key}
              r={3}
              fill={p.color}
              initial={{ cx: p.from.x, cy: p.from.y, opacity: 0 }}
              animate={{
                cx: [p.from.x, p.to.x],
                cy: [p.from.y, p.to.y],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 0.5,
                ease: 'easeInOut',
              }}
            />
          )
        })}

        {/* Agent nodes */}
        {visibleNodes.map((id) => {
          const pos = positions[id]
          const agent = agents[id]
          const isActive = activeAgents.includes(id)
          if (!agent || !pos) return null

          const isUserNode = id.startsWith('user')
          const isMemoryNode = id === 'memory'
          const nodeRadius = isUserNode ? 18 : isMemoryNode ? 24 : 22

          return (
            <g key={id}>
              {/* Glow */}
              <AnimatePresence>
                {isActive && (
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r={40}
                    fill={`url(#glow-${id})`}
                    initial={{ opacity: 0, r: 20 }}
                    animate={{ opacity: 1, r: 40 }}
                    exit={{ opacity: 0, r: 20 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </AnimatePresence>

              {/* Pulse ring */}
              {isActive && (
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeRadius + 2}
                  fill="none"
                  stroke={agent.color}
                  strokeWidth={1.5}
                  animate={{
                    r: [nodeRadius + 2, nodeRadius + 14],
                    strokeOpacity: [0.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              )}

              {/* Node circle */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={nodeRadius}
                fill={isActive ? agent.color + '25' : 'rgba(255,255,255,0.03)'}
                stroke={isActive ? agent.color : 'rgba(255,255,255,0.08)'}
                strokeWidth={isActive ? 2 : 1}
                strokeDasharray={isMemoryNode ? '3 3' : 'none'}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: isActive ? [1, 1.05, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: isActive ? Infinity : 0,
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                }}
              />

              {/* Icon */}
              <text
                x={pos.x}
                y={pos.y + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isUserNode ? 13 : 16}
                style={{ opacity: isActive ? 1 : 0.3 }}
              >
                {agent.icon}
              </text>

              {/* Label */}
              <text
                x={pos.x}
                y={pos.y + nodeRadius + 16}
                textAnchor="middle"
                fontSize={9}
                fontWeight={600}
                fontFamily="Inter, sans-serif"
                fill={isActive ? agent.color : '#444'}
              >
                {agent.name}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, background: '#93c5fd' }} />
          <span>Active Agent</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, background: '#333' }} />
          <span>Inactive</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendLine, background: '#93c5fd' }} />
          <span>Data Flow</span>
        </div>
        {currentStep >= 6 && (
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendDot, background: '#f472b6', border: '1px dashed #f472b6' }} />
            <span>Memory</span>
          </div>
        )}
        {currentStep >= 9 && (
          <>
            <div style={styles.legendItem}>
              <div style={{ ...styles.legendDot, background: '#2dd4bf' }} />
              <span>Learning</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{ ...styles.legendDot, background: '#fb923c' }} />
              <span>Tracking</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 16,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  svg: {
    flex: 1,
    maxWidth: '100%',
  },
  legend: {
    display: 'flex',
    gap: 16,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 11,
    color: '#555',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
  },
  legendLine: {
    width: 16,
    height: 2,
    borderRadius: 1,
  },
}
