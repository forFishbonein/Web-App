function Test() {
  return (<>
    {isAuthenticated ? (
      <>
        <Routes>
          <Route path="/member" element={<Home />} />
          {/* <Route path="/home" element={<Home />} /> */}
          {/* Catch all unhandled routes */}
          {/* <Route path="*" element={<Navigate to="/" />} /> */}
        </Routes>
      </>
    ) : (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/authenticate" element={<AuthenticationPage />} />
        {/* Redirect all non-authenticated users to login */}
        <Route path="*" element={<Navigate to="/authenticate" />} />
      </Routes>
    )}
  </>);
}

export default Test;