import React, { Suspense } from "react"

const Mark = React.lazy(() => import("./MarkdownPreviewer"))

export default function Editor(attrs: any) {
    return (
        <div {...attrs}>
            <Suspense fallback={<Loading/>}>
                <Mark/>
            </Suspense>
        </div>
    )
}

function Loading() {
    return (<span>Loading...</span>)
}