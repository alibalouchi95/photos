import React from 'react'
import { SafeAreaView, ViewStyle, View, TouchableOpacity } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import Config from 'react-native-config'

import OnboardingMessage from '../../Components/OnboardingMessage'
import ReferralCode from '../../Components/ReferralCode'
import OnboardingUsername from '../../Containers/OnboardingUsername'
import SetAvatar from '../../Containers/SetAvatar'
import MailListSignupScreen from '../../Containers/MailListSignupScreen'
import ChooseCafe from '../../Containers/ChooseCafe'
import InitializeTextile from '../InitializeTextile'
import { initializationActions } from '../../features/initialization'
import { RootAction, RootState } from '../../Redux/Types'
import { color, spacing } from '../../styles'

// Styles

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.screen_primary
}

const PROGRESS_BAR: ViewStyle = {
  height: 60,
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center'
}

const DOT: ViewStyle = {
  margin: 3,
  height: 8,
  width: 8,
  backgroundColor: color.action_6,
  borderRadius: 4
}

const DOT_ACTIVE: ViewStyle = {
  backgroundColor: color.action_4
}

// Components

// Individual dot displayed at bottom of screen. Is highlighted when active.
interface DotProps {
  active: boolean
}

const Dot = (props: DotProps) => {
  return <View style={[DOT, props.active && DOT_ACTIVE]} />
}

interface ProgressBarProps {
  length: number
  active: number
}

// List of dots displayed at the bottom of the screen as a progress bar
const ProgressBar = (props: ProgressBarProps) => {
  return (
    <View style={PROGRESS_BAR}>
      {[...Array(props.length).keys()].map(i => {
        return <Dot key={i} active={i === props.active} />
      })}
    </View>
  )
}

// Props & State

interface StateProps {
  referralCode?: string
  path: string
  currentPage: number
}

interface DispatchProps {
  nextPage: () => void
  selectPath: (path: string) => void
  complete: () => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps

class OnboardingScreen extends React.Component<Props> {
  complete = () => {
    this.props.complete()
    this.props.navigation.navigate('StatusCheck')
  }

  pages = () => {
    // The onboarding path is a stack of pages identified by a string
    // The pages in `default` are the those that the user must go through before
    // choosing an onboarding path. The last page in the list should call selectPath
    // to select the path the user will take
    const onboardingSuccessMessage = (
      <OnboardingMessage
        key="ready"
        title="All ready!"
        subtitle="You're all set up. Enjoy using Textile :)"
        image={require('./statics/sync.png')}
        buttonText="Get Started"
        onButtonPress={this.complete}
      />
    )
    const paths: {
      [path: string]: JSX.Element[]
    } = {
      default: [
        <ReferralCode
          key="referral"
          targetReferralCode={Config.RN_TEMPORARY_REFERRAL}
          referralCode={this.props.referralCode}
          onSuccess={this.props.nextPage}
        />,
        <InitializeTextile
          key="account"
          onSuccess={(path: string) => this.props.selectPath(path)}
        />
      ],
      newAccount: [
        <ChooseCafe key="cafe" onSuccess={this.props.nextPage} />,
        <OnboardingUsername key="username" onSuccess={this.props.nextPage} />,
        <SetAvatar key="avatar" onSuccess={this.props.nextPage} />,
        <MailListSignupScreen key="mail" onSuccess={this.props.nextPage} />,
        onboardingSuccessMessage
      ],
      existingAccount: [
        <ChooseCafe key="cafe" onSuccess={this.props.nextPage} />,
        <MailListSignupScreen key="mail" onSuccess={this.props.nextPage} />,
        onboardingSuccessMessage
      ]
    }
    return paths[this.props.path]
  }

  render() {
    const pages = this.pages()
    return (
      <SafeAreaView style={CONTAINER}>
        <View style={CONTAINER}>
          <View style={[CONTAINER, { marginBottom: spacing._016 }]}>
            {pages[this.props.currentPage]}
          </View>
          {this.props.path !== 'default' && (
            <ProgressBar
              length={pages.length}
              active={this.props.currentPage}
            />
          )}
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  referralCode:
    state.auth.invite !== undefined ? state.auth.invite.referral : undefined,
  path: state.initialization.onboarding.path,
  currentPage: state.initialization.onboarding.currentPage
})

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  complete: () => dispatch(initializationActions.onboardingSuccess()),
  nextPage: () => dispatch(initializationActions.nextPage()),
  selectPath: (path: string) =>
    dispatch(initializationActions.chooseOnboardingPath(path))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingScreen)
