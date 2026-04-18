const mongoose = require('mongoose');
const User = require('../src/models/User');
const stripe = require('../src/utils/stripe');
const env = require('../src/config/env');

require('dotenv').config({ path: '../.env' });

const createAccountsForDesigners = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log('Conectado a MongoDB');

        const designers = await User.find({ role: 'designer', stripeAccountId: { $exists: false } });
        console.log(`Encontrados ${designers.length} diseñadores sin cuenta Stripe`);

        for (const designer of designers) {
            try {
                // Crear cuenta Connect Express
                const account = await stripe.accounts.create({
                    type: 'express',
                    country: 'PT', // Portugal
                    email: designer.email,
                    business_type: 'individual',
                    capabilities: {
                        transfers: { requested: true },
                    },
                    metadata: { userId: designer._id.toString() },
                });

                designer.stripeAccountId = account.id;
                designer.stripeAccountStatus = 'pending';
                await designer.save();

                // Generar link de onboarding
                const accountLink = await stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: `${env.FRONTEND_URL}/dashboard/designer/earnings?refresh=true`,
                    return_url: `${env.FRONTEND_URL}/dashboard/designer/earnings?success=true`,
                    type: 'account_onboarding',
                });

                console.log(`Diseñador ${designer.email} -> Cuenta: ${account.id}`);
                console.log(`Link de onboarding: ${accountLink.url}`);
            } catch (err) {
                console.error(`Error con ${designer.email}:`, err.message);
            }
        }

        await mongoose.disconnect();
        console.log('Script finalizado');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAccountsForDesigners();