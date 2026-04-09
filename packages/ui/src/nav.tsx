import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle} from "@workspace/ui/components/empty"
import { Button } from "@workspace/ui/components/button"
import nav from "./styles/nav.module.css"

export default function Nav() {
    return (
        <nav>
            <Empty>
                <EmptyHeader>
                    <EmptyTitle className={nav.emptyTitle}>
                        Monitor the status of your beacons in real-time <br></br> with EchoNav's intuitive dashboard.
                    </EmptyTitle>
                    <EmptyDescription className={nav.emptyDescription}>
                        Click the "Get Started" button to access your personalized dashboard and <br></br> stay connected with your fleet's activities.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent className={nav.emptyContainer}>
                    <Button className={nav.emptyButtons}>Get Started</Button>
                    <Button className={nav.emptyButtons}>Learn More</Button>
                </EmptyContent>
            </Empty>
        </nav>
    )
}