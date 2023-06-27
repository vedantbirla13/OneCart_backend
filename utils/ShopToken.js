// create token and saving in that cookie
const sendShopToken = (user, statusCode, res) => {
    const sellerToken = user.getJwtToken();

    // options for cookies
    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000 ),
        sameSite: "none",
        secure: true,
        httpOnly: true,
    };

    res.status(statusCode).cookie("Shop_token", sellerToken, options).json({
        success: true,
        user,
        token,
    });
};

export default sendShopToken