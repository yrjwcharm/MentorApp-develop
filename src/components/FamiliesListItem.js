import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text, StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment'
import 'moment/locale/es'
import colors from '../theme.json'
import globalStyles from '../globalStyles'
import ListItem from './ListItem'

moment.locale('en')

class FamiliesListItem extends Component {
  capitalize = s => {
    if (typeof s !== 'string') return ''
    const string = s.split('.').join('')
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  render() {
    const { family, lng } = this.props
    const firstParticipant =
      family.snapshotList && family.snapshotList.length
        ? family.snapshotList[0].familyData.familyMembersList.find(
            item => item.firstParticipant
          )
        : null
    const birthDate = firstParticipant
      ? firstParticipant.birthDate
      : family.birthDate

    const birthDateWithLocale = moment.unix(birthDate)
    birthDateWithLocale.locale(lng)

    return (
      <ListItem
        style={{ ...styles.listItem }}
        onPress={this.props.handleClick}
        disabled={family.snapshotList && !family.snapshotList.length}
      >
        <View>
          {family.snapshotList &&
            family.snapshotList[0] &&
            family.snapshotList[0].familyData.countFamilyMembers &&
            family.snapshotList[0].familyData.countFamilyMembers > 1 && (
              <View style={styles.countCircleWrapper}>
                <View style={styles.countCircle}>
                  <Text style={[globalStyles.h4, { color: colors.lightdark }]}>
                    + {family.snapshotList[0].familyData.countFamilyMembers - 1}
                  </Text>
                </View>
              </View>
            )}

          <Icon name="face" color={colors.grey} size={40} />
        </View>
        <View style={styles.listItemContainer}>
          <Text style={{ ...globalStyles.p, ...styles.p }}>{family.name}</Text>
          {!family.snapshotList ||
          (family.snapshotList && family.snapshotList.length) ? (
            <Text
              style={{ ...globalStyles.subline, ...styles.p }}
              accessibilityLabel={
                birthDate
                  ? `Date Of Birth: ${birthDateWithLocale
                      .utc()
                      .format('MMMM DD, YYYY')}`
                  : ''
              }
            >
              {birthDate
                ? `D.O.B: ${this.capitalize(
                    birthDateWithLocale.utc().format('MMM DD, YYYY')
                  )}`
                : ''}
            </Text>
          ) : (
            <Text
              style={{
                ...globalStyles.subline,
                ...styles.p,
                color: colors.palered
              }}
            >
              {this.props.error}
            </Text>
          )}
        </View>
      </ListItem>
    )
  }
}

FamiliesListItem.propTypes = {
  family: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  error: PropTypes.string,
  birthDate: PropTypes.number,
  lng: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
  listItem: {
    height: 95,
    paddingLeft: 25,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  listItemContainer: {
    height: 95,
    borderBottomColor: colors.lightgrey,
    borderBottomWidth: 1,
    marginLeft: 25,
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'center'
  },
  p: {
    paddingRight: 20
  },
  countCircleWrapper: {
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  countCircle: {
    width: 22,
    height: 22,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: 13 }, { translateY: -13 }]
  }
})

export default FamiliesListItem
