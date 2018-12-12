import { createAction, ActionType, getType } from 'typesafe-actions'
import { AppStateStatus } from 'react-native'
import { RootState } from './Types'

const actions = {
  appStateChange: createAction('APP_STATE_CHANGE', (resolve) => {
    return (previousState: TextileAppStateStatus, newState: AppStateStatus) => resolve({ previousState, newState })
  }),
  migrationNeeded: createAction('MIGRATION_NEEDED'),
  initMigration: createAction('INIT_MIGRATION'),
  initMigrationSuccess: createAction('INIT_MIGRATION_SUCCESS'),
  migrateNode: createAction('MIGRATE_NODE'),
  migrationSuccess: createAction('MIGRATION_SUCCESS'),
  creatingWallet: createAction('CREATING_WALLET'),
  derivingAccount: createAction('DERIVING_ACCOUNT'),
  initializingRepo: createAction('INITIALIZING_REPO'),
  createNodeRequest: createAction('CREATE_NODE_REQUEST'),
  creatingNode: createAction('CREATING_NODE'),
  createNodeSuccess: createAction('CREATE_NODE_SUCCESS'),
  startingNode: createAction('STARTING_NODE'),
  startNodeSuccess: createAction('START_NODE_SUCCESS', (resolve) => {
    return () => resolve()
  }),
  stoppingNode: createAction('STOP_NODE_REQUEST'),
  stopNodeSuccess: createAction('STOP_NODE_SUCCESS', (resolve) => {
    return () => resolve()
  }),
  nodeError: createAction('NODE_ERROR', (resolve) => {
    return (error: any) => resolve({ error })
  }),
  nodeOnline: createAction('NODE_ONLINE', (resolve) => {
    return () => resolve()
  }),
  ignorePhotoRequest: createAction('IGNORE_PHOTO_REQUEST', (resolve) => {
    return (blockId: string) => resolve({ blockId })
  }),
  refreshMessagesRequest: createAction('REFRESH_MESSAGES_REQUEST', (resolve) => {
    return () => resolve()
  }),
  refreshMessagesSuccess: createAction('REFRESH_MESSAGES_SUCCESS', (resolve) => {
    return (timestamp: number) => resolve({ timestamp })
  }),
  refreshMessagesFailure: createAction('REFRESH_MESSAGES_FAILURE', (resolve) => {
    return (error: Error) => resolve({ error })
  }),
  updateOverviewRequest: createAction('UPDATE_OVERVIEW_REQUEST', (resolve) => {
    return () => resolve()
  })
}

export type TextileNodeAction = ActionType<typeof actions>

type TextileAppStateStatus = AppStateStatus | 'unknown'

export enum NodeState {
  'nonexistent' = 'nonexistent',
  'creating' = 'creating',
  'created' = 'created', // Node has been created, on it's way to starting
  'starting' = 'starting',
  'started' = 'started',
  'stopping' = 'stopping',
  'stopped' = 'stopped', // Node has been explicitly stopped, different than created
  'migrationNeeded' = 'migrationNeeded',
  'initingMigration' = 'initingMigration',
  'pendingMigration' = 'pendingMigration',
  'migrating' = 'migrating',
  'migrationComplete' = 'migrationComplete',
  'creatingWallet' = 'creatingWallet',
  'derivingAccount' = 'derivingAccount',
  'initializingRepo' = 'initializingRepo'
}

export enum MigrationState {
  'idle',
  'pending',
  'migrating',
  'complete'
}

interface TextileNodeState {
  readonly appState: TextileAppStateStatus
  readonly appStateUpdate: string
  readonly online: boolean
  readonly nodeState: {
    readonly state: NodeState
    readonly error?: string
  }
  readonly refreshingMessages: boolean
}

function getHMS() {
  const now = new Date()
  return [
    now.getHours().toString(),
    now.getMinutes().toString(),
    now.getSeconds().toString()
  ].join(':')
}
export const initialState: TextileNodeState = {
  appState: 'unknown',
  appStateUpdate: getHMS(),
  online: false,
  nodeState: {
    state: NodeState.nonexistent
  },
  refreshingMessages: false
}

export function reducer (state: TextileNodeState = initialState, action: TextileNodeAction): TextileNodeState {
  switch (action.type) {
    case getType(actions.appStateChange):
      return { ...state, appState: action.payload.newState, appStateUpdate: getHMS() }
    case getType(actions.migrationNeeded):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.migrationNeeded } }
    case getType(actions.initMigration):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.initingMigration } }
    case getType(actions.initMigrationSuccess):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.pendingMigration } }
    case getType(actions.migrateNode):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.migrating } }
    case getType(actions.migrationSuccess):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.migrationComplete } }
    case getType(actions.creatingWallet):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.creatingWallet } }
    case getType(actions.derivingAccount):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.derivingAccount } }
    case getType(actions.initializingRepo):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.initializingRepo } }
    case getType(actions.creatingNode):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.creating } }
    case getType(actions.createNodeSuccess):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.created } }
    case getType(actions.startingNode):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.starting } }
    case getType(actions.startNodeSuccess):
      return { ...state, nodeState: {...state.nodeState, state: NodeState.started, error: undefined } }
    case getType(actions.stoppingNode):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.stopping } }
    case getType(actions.stopNodeSuccess):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.stopped } }
    case getType(actions.nodeError): {
      const { error } = action.payload
      const errorMessage = (error.message as string) || (error as string) || 'unknown'
      return { ...state, nodeState: { ...state.nodeState, error: errorMessage } }
    }
    case getType(actions.nodeOnline):
      return { ...state, online: true }
    case getType(actions.refreshMessagesRequest):
      return { ...state, refreshingMessages: true }
    case getType(actions.refreshMessagesSuccess):
    case getType(actions.refreshMessagesFailure):
      return { ...state, refreshingMessages: false }
    default:
      return state
  }
}

// TODO: create RootState type that will be passed into these
export const TextileNodeSelectors = {
  appState: (state: RootState) => state.textileNode.appState,
  nodeState: (state: RootState) => state.textileNode.nodeState.state,
  online: (state: RootState) => state.textileNode.online,
  refreshingMessages: (state: RootState) => state.textileNode.refreshingMessages
}

export default actions
