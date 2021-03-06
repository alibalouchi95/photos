import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import {
  KeyboardAvoidingView,
  Image,
  Text,
  ViewStyle,
  ImageStyle,
  TextStyle,
  View
} from 'react-native'

import Input from '../../SB/components/Input'
import Button from '../../Components/LargeButton'
import { RootAction, RootState } from '../../Redux/Types'
import { accountActions } from '../../features/account'
import { OnboardingChildProps } from './onboarding-container'
import { color, textStyle, spacing, fontFamily } from '../../styles'

const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'space-evenly',
  paddingHorizontal: spacing._016,
  backgroundColor: color.screen_primary
}

const IMAGE: ImageStyle = {
  marginBottom: spacing._016
}

const ITEM: ViewStyle = {
  marginBottom: spacing._016
}

const TITLE: TextStyle = {
  ...ITEM,
  ...textStyle.header_l
}

const SUBTITLE: TextStyle = {
  ...ITEM,
  ...textStyle.body_l
}

const TEXT: TextStyle = textStyle.body_l

const LABEL: TextStyle = {
  fontFamily: fontFamily.regular
}

const BUTTON: ViewStyle = {
  ...ITEM,
  alignSelf: 'center'
}

interface OwnProps {
  suggestion?: string
}

interface StateProps {
  processing: boolean
  username?: string
  buttonText: string
}

interface DispatchProps {
  submitUsername: (username: string) => void
}

type Props = OwnProps & StateProps & DispatchProps & OnboardingChildProps

interface State {
  valid: boolean
  nextDisabled: boolean
  username?: string
  error?: string
}

class OnboardingUsername extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      valid: false,
      nextDisabled: false
    }
  }

  submit = () => {
    const { username } = this.state
    if (username) {
      this.props.submitUsername(username)
    }
    // prevent double tap, disable for as long as onSuccess takes
    this.setState({
      nextDisabled: true
    })
    setTimeout(() => {
      this.setState({
        nextDisabled: false
      })
    }, 1000)

    // Call on success
  }

  componentDidMount = () => {
    if (this.props.username && this.props.onComplete) {
      this.props.onComplete()
    }
    if (this.props.suggestion) {
      this.updateText(this.props.suggestion)
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.username && this.props.username !== prevProps.username) {
      setTimeout(() => {
        if (this.props.onComplete) {
          this.props.onComplete()
        }
      }, 2500)
    }
  }

  updateText = (text: string) => {
    this.setState({
      username: text,
      valid: this.valid(text)
    })
  }

  valid = (username?: string) => {
    if (!username) {
      return false
    }
    return username.length > 0
  }

  render() {
    return (
      <KeyboardAvoidingView style={CONTAINER} behavior={'padding'}>
        <View>
          <Image style={IMAGE} source={require('./statics/share.png')} />
          <Text style={TITLE}>Choose a display name</Text>
          <Text style={SUBTITLE}>
            It will be shown when you share, comment, or like a photo.
          </Text>
          <Input
            label={'Display name'}
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
            style={{ height: 40 }}
            inputStyle={TEXT}
            labelStyle={LABEL}
            value={this.state.username}
            onChangeText={this.updateText}
            wrapperStyle={ITEM}
          />
          <Button
            text={this.props.buttonText}
            disabled={!this.state.valid || this.state.nextDisabled}
            processing={this.props.processing}
            onPress={this.submit}
            style={BUTTON}
          />
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  const username =
    state.account.profile.value &&
    state.account.profile.value.name &&
    state.account.profile.value.name.length > 0
      ? state.account.profile.value.name
      : undefined
  return {
    processing: state.account.profile.processing,
    username,
    buttonText: username ? 'Success!' : 'Save'
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  submitUsername: (username: string) =>
    dispatch(accountActions.setUsernameRequest(username))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingUsername)
