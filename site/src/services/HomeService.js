class HomeService {

    constructor(homeModel, mailer) {
        this.homeModel = homeModel;
        this.mailer = mailer;
    }

    processContactForm = async (data) => {

        const { nameForm, emailForm, txtArea } = data;
        await this.homeModel.addMessageForm(nameForm, emailForm, txtArea);
        return true;
    }
}
module.exports = HomeService;