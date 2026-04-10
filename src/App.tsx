import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Alert from 'react-bootstrap/Alert'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [showAlert, setShowAlert] = useState(true)

  return (
    <>
      {/* React Bootstrap Demo Section */}
      <Container className="my-5">
        <Row className="mb-4">
          <Col>
            <h1 className="text-center mb-4">React Bootstrap Demo</h1>
            {showAlert && (
              <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                <Alert.Heading>Hey, welcome to Smart API!</Alert.Heading>
                <p>
                  React Bootstrap has been successfully installed and configured. This is a demo
                  of some common components you can use.
                </p>
              </Alert>
            )}
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Button Variants</Card.Title>
                <div className="d-grid gap-2">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="warning">Warning</Button>
                  <Button variant="info">Info</Button>
                  <Button variant="light">Light</Button>
                  <Button variant="dark">Dark</Button>
                  <Button variant="link">Link</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Counter Demo</Card.Title>
                <Card.Text>
                  Current count: <strong>{count}</strong>
                </Card.Text>
                <div className="d-flex gap-2">
                  <Button variant="primary" onClick={() => setCount(count + 1)}>
                    + Increment
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setCount(0)}
                    disabled={count === 0}
                  >
                    Reset
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Form Example</Card.Title>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="name@example.com" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Example textarea</Form.Label>
                    <Form.Control as="textarea" rows={3} />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Card>
              <Card.Header>Featured Card</Card.Header>
              <Card.Body>
                <Card.Title>Smart API Project</Card.Title>
                <Card.Text>
                  This is a React + TypeScript + Vite application with React Bootstrap as the UI
                  framework. You can now use any Bootstrap component in your app!
                </Card.Text>
                <Button variant="primary">Learn More</Button>
              </Card.Body>
              <Card.Footer className="text-muted">Built with React 19</Card.Footer>
            </Card>
          </Col>

          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Available Components</Card.Title>
                <Card.Text>
                  React Bootstrap includes many components:
                </Card.Text>
                <ul>
                  <li>Alerts, Badges, Buttons</li>
                  <li>Cards, Carousels</li>
                  <li>Dropdowns, Forms</li>
                  <li>Modals, Navbars</li>
                  <li>Tables, Tabs, Tooltips</li>
                  <li>And many more!</li>
                </ul>
                <Button variant="outline-primary" href="https://react-bootstrap.github.io/" target="_blank">
                  View Documentation
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <hr className="my-5" />

      {/* Original App Content */}
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
