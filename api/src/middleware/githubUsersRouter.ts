import { Router } from 'express';
import { getUserProfileDataService } from '../services/getUserProfileDataService';
import { itemEnvelope } from './responseEnvelope';

const githubUsersRouter = Router();

githubUsersRouter.get('/', async (req, res, next) => {
  const { principalId } = req.session;
  console.log({session: principalId })
  let userData
  try {
    userData = await 
    //@param: principalId
    getUserProfileDataService(1)
  } catch(err) {
    console.log('err', err)
    next(err);
    return;
  }

  console.log({userData: userData})
  res.json(itemEnvelope(userData))

});

export default githubUsersRouter;
