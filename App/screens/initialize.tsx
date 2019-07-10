import React, { Component } from 'react'
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ViewStyle,
  ImageStyle,
  TextStyle,
  Insets
} from 'react-native'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import Config from 'react-native-config'
import Modal from 'react-native-modal'

import Button from '../Components/SmallButton'
import WaitListSignupScreen from '../Components/WaitListSignupScreen'

import { RootState, RootAction } from '../Redux/Types'
import { initializationActions } from '../features/initialization'
import { spacing, textStyle, fontFamily, color, size } from '../styles'
import { OnboardingPath } from '../features/initialization/models'

const targetReferralCode = Config.RN_TEMPORARY_REFERRAL

const SAFE_AREA: ViewStyle = {
  flex: 1,
  backgroundColor: color.screen_primary
}

const CONTAINER: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing._016,
  justifyContent: 'center',
  alignItems: 'stretch',
  backgroundColor: color.screen_primary
}

const INNER_CONTAINER: ViewStyle = {}

const IMAGE: ImageStyle = {
  marginBottom: spacing._016,
  alignSelf: 'center'
}

const ITEM: ViewStyle = {
  marginBottom: spacing._016
}

const TITLE: TextStyle = {
  ...ITEM,
  ...textStyle.header_l,
  marginTop: spacing._016,
  textAlign: 'center',
  color: color.grey_2
}

const SUBTITLE: TextStyle = {
  ...ITEM,
  ...textStyle.body_l,
  color: color.grey_2
}

const TEXT_INPUT: TextStyle = {
  ...textStyle.body_l,
  color: color.grey_2,
  borderBottomColor: color.grey_4,
  borderBottomWidth: 1,
  marginBottom: spacing._004
}

const BUTTON: ViewStyle = {
  ...ITEM,
  alignSelf: 'stretch',
  backgroundColor: color.brandBlue
}

const BUTTON_TEXT: TextStyle = {
  color: color.screen_primary
}

const BUTTON2: ViewStyle = {
  ...ITEM,
  alignSelf: 'stretch',
  backgroundColor: 'transparent',
  borderColor: color.brandBlue,
  borderWidth: 1
}

const BUTTON_TEXT2: TextStyle = {
  color: color.brandBlue
}

const LINK: TextStyle = {
  ...ITEM,
  ...textStyle.body_m,
  color: color.action_4
}

const HIT_SLOP: Insets = {
  top: spacing._004,
  left: spacing._016,
  bottom: spacing._016,
  right: spacing._016
}

interface OwnProps {
  referralCode?: string
}

interface StateProps {}

interface DispatchProps {
  onboardNewAccount: () => void
  onboardExistingAccount: () => void
}

type Props = StateProps & DispatchProps & OwnProps

interface State {
  valid: boolean
  referralCode?: string
  showWaitlistSignup: boolean
}

class Initialize extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      valid:
        (props.referralCode && props.referralCode.trim().toLowerCase()) ===
        targetReferralCode.trim().toLowerCase(),
      showWaitlistSignup: false
    }
  }

  render() {
    return (
      <SafeAreaView style={SAFE_AREA}>
        <KeyboardAvoidingView style={CONTAINER} behavior={'padding'}>
          <View style={{ flex: 1 }} />
          <View>
            <Text style={TITLE}>Welcome to Textile!</Text>
            <Image style={IMAGE} source={require('../Images/Icon_100.png')} />
            <Text style={SUBTITLE}>
              With Textile, you can securely share photos and messages with the
              people you care about while maintaining ownership of your data.
              {'\n\n'}
              Enter your referral code below to begin.
            </Text>
            <TextInput
              placeholder={'Referral Code...'}
              placeholderTextColor={color.grey_4}
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
              style={TEXT_INPUT}
              onChangeText={this.updateText}
              value={this.state.referralCode}
            />
            <TouchableOpacity
              onPress={this.showWaitlistSignup}
              hitSlop={HIT_SLOP}
              style={{ alignSelf: 'flex-end' }}
            >
              <Text style={LINK}>Need a code?</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }} />
          <View style={{ alignSelf: 'center' }}>
            <Button
              text="Create New Account"
              disabled={!this.state.valid}
              onPress={this.props.onboardNewAccount}
              style={BUTTON}
              textStyle={BUTTON_TEXT}
            />
            <Button
              text="Sync Existing Account"
              disabled={!this.state.valid}
              onPress={this.props.onboardExistingAccount}
              style={BUTTON2}
              textStyle={BUTTON_TEXT2}
            />
          </View>
          <View style={{ flex: 1 }} />
          <Modal
            style={{ flex: 1, margin: 0 }}
            isVisible={this.state.showWaitlistSignup}
          >
            <WaitListSignupScreen onSuccess={this.hideWaitlistSignup} />
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  updateText = (text: string) => {
    this.setState({
      referralCode: text,
      valid:
        text.trim().toLowerCase() === targetReferralCode.trim().toLowerCase()
    })
  }

  showWaitlistSignup = () => {
    this.setState({
      showWaitlistSignup: true
    })
  }

  hideWaitlistSignup = () => {
    this.setState({
      showWaitlistSignup: false
    })
  }
}

function mapStateToProps(state: RootState): StateProps {
  return {}
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>): DispatchProps {
  return {
    onboardNewAccount: () =>
      dispatch(
        initializationActions.chooseOnboardingPath(OnboardingPath.newAccount)
      ),
    onboardExistingAccount: () =>
      dispatch(
        initializationActions.chooseOnboardingPath(
          OnboardingPath.existingAccount
        )
      )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Initialize)