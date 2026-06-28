import './styles/site.css'
import { useSiteMotion } from './lib/useSiteMotion'
import { HomePage } from '../pages/home'

export default function App() {
  useSiteMotion()

  return <HomePage />
}
