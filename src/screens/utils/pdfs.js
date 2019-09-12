import colors from '../../theme.json'
import moment from 'moment'
import 'moment/locale/es'
import {
  priorityIcon,
  achievementIcon,
  styles,
  priorityIconWithoutStyles
} from './assets'

moment.locale('en')
const MAX_COLS = 5

export const getReportTitle = snapshot => {
  const firstParticipant = snapshot.familyData.familyMembersList.find(
    m => !!m.firstParticipant
  )
  return `${firstParticipant.firstName} ${firstParticipant.lastName}`
}

export const getIndicatorQuestionByCodeName = (codeName, survey) => {
  const { surveyStoplightQuestions: questions } = survey
  return questions.find(q => q.codeName === codeName).questionText
}

export const getColor = value => {
  switch (value) {
    case 1:
      return colors.palered
    case 2:
      return colors.gold
    case 3:
      return colors.palegreen
    case 0:
      return colors.palegrey

    default:
      return colors.palegrey
  }
}

const createTableRow = (indicatorsArray, survey, achievements, priorities) => {
  return `<tr style="${styles.tableRow}">
              ${indicatorsArray
                .map(indicator => {
                  const color = getColor(indicator.value)
                  const title = getIndicatorQuestionByCodeName(
                    indicator.key,
                    survey
                  )
                  return `<td style="width: ${100 / MAX_COLS}%;${
                    styles.tableData
                  }">
                              <div style="${styles.indicatorWrapper}">
                            ${
                              achievements.some(
                                a => a.indicator === indicator.key
                              )
                                ? achievementIcon
                                : ''
                            }
                            ${
                              priorities.some(
                                p => p.indicator === indicator.key
                              )
                                ? priorityIcon
                                : ''
                            }
                            <div style="${
                              styles.ball
                            }background-color:${color};"></div>
                            <span style="${
                              styles.indicatorName
                            }">${title}</span>
                            <div>
                          </td>`
                })
                .join('')}
            </tr>`
}

const generateTableHeaderForPriorities = (dateCreated, t) => `
  <div style="${styles.wrapperPriority};page-break-before: always;">
              <h2 style="${styles.title}">${t(
  'views.lifemap.myPriorities'
)} ${priorityIconWithoutStyles}</h2>
              <h2 style="${styles.date};margin-top:40px;">${dateCreated}</h2>
            </div>
  <tr>
    <th style="${styles.tHeader}">${t('views.lifemap.status')}</th>
    <th style="${styles.tHeader};text-align:left;">${t(
  'views.lifemap.indicator'
)}</th>
    <th style="${styles.tHeader}">${t('views.lifemap.whyDontYouHaveIt')}</th>
    <th style="${styles.tHeader}">${t(
  'views.lifemap.whatWillYouDoToGetIt'
)}</th>
    <th style="${styles.tHeader}">${t('views.lifemap.monthsRequired')}</th>
    <th style="${styles.tHeader}">${t('views.lifemap.reviewDate')}</th>
    </tr>`

const generatePrioritiesTable = (
  priorities,
  dateCreated,
  survey,
  indicatorsArray,
  lng,
  t
) => {
  return `
          <table cellspacing="0" stye="${
            styles.tableWithHeader
          };page-break-after: always;">
            ${generateTableHeaderForPriorities(dateCreated, t)}
            ${priorities
              .map((priority, index) => {
                const stripe = index % 2 !== 0
                const { reason, action, estimatedDate, indicator } = priority
                const indicatorValue = indicatorsArray.find(
                  i => i.key === indicator
                ).value
                const color = getColor(indicatorValue)
                const dateForReviewWithLocale = moment(dateCreated)

                dateForReviewWithLocale.locale(lng)
                const dateForReview = dateForReviewWithLocale
                  .add(estimatedDate, 'months')
                  .format('DD MMM, YYYY')
                return `<tr style="${stripe ? 'background-color:#eeeeee' : ''}">
                          <td style="${styles.tData}">
                            <div style="${styles.indicatorWrapper}">
                              <div style="${
                                styles.smallBall
                              }background-color:${color};"></div>
                            <div>
                        </td>
                          <td style="${
                            styles.tData
                          }text-transform:capitalize;text-align:left;">${getIndicatorQuestionByCodeName(
                  indicator,
                  survey
                )}</td>
                          <td style="${styles.tData}">${reason}</td>
                          <td style="${styles.tData}">${action}</td>
                          <td style="${styles.tData}">${estimatedDate}</td>
                          <td style="text-align:center">${dateForReview}</td>
                        </tr>`
              })
              .join('')}
            
          </table>`
}

const generateLifeMapHtmlTemplate = (draft, survey, lng, t) => {
  const indicatorsList = draft.indicatorSurveyDataList
  const achievements = draft.achievements
  const priorities = draft.priorities
  const dateCreatedWithLocale =
    draft && draft.created && moment.utc(draft.created)
  dateCreatedWithLocale.locale(lng)
  const dateCreated = dateCreatedWithLocale.format('MMMM D, YYYY')
  const reportTitle = getReportTitle(draft)

  return `<div style="${styles.wrapper}">
            <h2 style="${styles.title}">${reportTitle}, ${t(
    'views.lifemap.lifeMap'
  )}</h2>
            <h2 style="${styles.date}">${dateCreated}</h2>
          </div>
          <table style="${styles.table}">${indicatorsList
    .map((indicator, index) => {
      if (index % MAX_COLS === 0) {
        return createTableRow(
          indicatorsList.slice(index, index + MAX_COLS),
          survey,
          achievements,
          priorities
        )
      }
    })
    .join('')}
        </table>
        ${generatePrioritiesTable(
          priorities,
          dateCreated,
          survey,
          indicatorsList,
          lng,
          t
        )}
        `
}

export const buildPrintOptions = (draft, survey, lng, t) => {
  return {
    html: generateLifeMapHtmlTemplate(draft, survey, lng, t)
  }
}

export const buildPDFOptions = (draft, survey, lng, t) => {
  return {
    html: generateLifeMapHtmlTemplate(draft, survey, lng, t),
    fileName: `${getReportTitle(draft)}, Life Map`,
    directory: 'docs',
    padding: 0,
    height: 842,
    width: 595
  }
}
