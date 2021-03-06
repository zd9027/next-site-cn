import Page from '../components/page'
import Slider from '../components/showcase/slider'
import {generateShowcaseUrl} from '../components/showcase/slider/showcase-link'
import {sortOrder, mapping} from '../showcase-manifest'
import {withRouter} from 'next/router'
import Screen from '../components/screen'

// Returns the right slide index based on the current position
function normalizeSlideIndex(arr, index, fn) {
  // The logic doesn't care about the implementation, just the result
  const result = fn(index)

  // If the result is bigger than the length of the array we return the start of the array
  if(result > (arr.length - 1)) {
    return 0
  }

  // If the result is lower than the start of the array we return the end of the array
  if(result < 0) {
    return arr.length -1
  }

  // If the result is within the array parameters we return it
  return result
}

// Since objects don't allow for a sort order we have to map an array to the object
function mapIndexToRoute(index) {
  const route = sortOrder[index]
  return mapping[route]
}

function calculateSlides(sortOrder, route) {
  let currentSlideIndex = sortOrder.indexOf(route)
  if(currentSlideIndex === -1) {
    currentSlideIndex = 0
  }
  const previousSlideIndex = normalizeSlideIndex(sortOrder, currentSlideIndex, (x) => x - 1)
  const nextSlideIndex = normalizeSlideIndex(sortOrder, currentSlideIndex, (x) => x + 1)
  return {
    currentSlide: mapIndexToRoute(currentSlideIndex),
    previousSlide: mapIndexToRoute(previousSlideIndex),
    nextSlide: mapIndexToRoute(nextSlideIndex)
  }
}

class ArrowEvents extends React.Component {
  handleKeyDown = (event) => {
    const isLeft = event.keyCode === 37
    const isRight = event.keyCode === 39

    const {router, previousSlide, nextSlide} = this.props
    if(isLeft) {
      const {href, as} = generateShowcaseUrl(previousSlide)
      router.replace(href, as)
      return
    }

    if(isRight) {
      const {href, as} = generateShowcaseUrl(nextSlide)
      router.replace(href, as)
      return
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  render() {
    return null
  }
}

function Showcase({router}) {
  const {query} = router
  const {item} = query
  const {currentSlide, previousSlide, nextSlide} = calculateSlides(sortOrder, item)
  return <Page>
    <ArrowEvents router={router} previousSlide={previousSlide} nextSlide={nextSlide} />
    <Screen offset={144}>
      <Slider currentSlide={currentSlide} previousSlide={previousSlide} nextSlide={nextSlide} />
    </Screen>
  </Page>
}

export default withRouter(Showcase)
