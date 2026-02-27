import React from 'react'

function OAuthRedirect(props) {
    React.useEffect(() => {
        var url = new URLSearchParams(props.location.search).get("url")
        var origin = new URLSearchParams(props.location.search).get("cb")
        window.sessionStorage.setItem("cb", origin)
        url = window.atob(url)
        window.location.href = url
    })

    return (
        <>
            <div>Redirecting...</div>
        </>
    )
}

export default OAuthRedirect;
