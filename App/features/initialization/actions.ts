import { createAction } from 'typesafe-actions'

export const initializeNewAccount = createAction(
  'initialization/INITIALIZE_CREATING_NEW_WALLET_AND_ACCOUNT',
  resolve => {
    return () => resolve()
  }
)

export const initializeExistingAccount = createAction(
  'initialization/INITIALIZE_WITH_EXISTING_ACCOUNT_SEED',
  resolve => {
    return (seed: string) => resolve({ seed })
  }
)

export const nodeInitialized = createAction('initialization/NODE_INITIALIZED', resolve => {
  return () => resolve()
})

export const failedToInitializeNode = createAction(
  'initialization/FAILED_TO_INITIALIZE_NODE',
  resolve => {
    return (error: any) => resolve({ error })
  }
)

export const chooseOnboardingPath = createAction(
  'initialization/CHOOSE_ONBOARDING_PATH',
  resolve => {
    return (path: string) => resolve({ path })
  }
)

export const setCurrentPage = createAction(
  'initialization/SET_CURRENT_PAGE_ONBOARDING',
  resolve => {
    return (page: number) => resolve({ page })
  }
)

export const nextPage = createAction('initialization/NEXT_PAGE_ONBOARDING', resolve => {
  return () => resolve()
})

export const onboardingSuccess = createAction(
  'initialization/COMPLETE_ONBOARDING',
  resolve => {
    return () => resolve()
  }
)
