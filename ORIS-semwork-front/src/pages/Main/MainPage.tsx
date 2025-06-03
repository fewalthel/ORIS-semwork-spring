import {MainHeader} from "@pages/Main/MainHeader";
import '@styles/main.css'

export const MainPage = () => {

    return (
        <>
            <MainHeader/>
            <main>
                <div id="head-container">
                    <section id="hero">
                        <h1 className="h1">Teach your friend</h1>
                        <h3>space to help each other with their studies</h3>
                    </section>

                    <img src="/logo.png" alt="logo of this site"/>
                </div>

                <section id="features">
                    <div className="feature-card">
                        <h4>Experience fast responses to your questions</h4>
                    </div>
                    <div className="feature-card">
                        <h4>Earn rewards for helping others</h4>
                    </div>
                    <div className="feature-card">
                        <h4>Join to the friendly community</h4>
                    </div>
                </section>
                <br/><br/><br/>
            </main>
        </>
    )
}