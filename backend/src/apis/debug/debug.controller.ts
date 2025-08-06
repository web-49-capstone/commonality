import type { Request, Response } from 'express'
import { sql } from '../../utils/database.utils.ts';
import { selectGroupMessagesByGroupId } from '../group-message/group-message.model.ts';
import { checkUserGroupMembership } from '../group-message/group-message.model.ts';

export async function debugSessionController(request: Request, response: Response): Promise<void> {
  try {
    const debugInfo = {
      session: {
        exists: !!request.session,
        keys: request.session ? Object.keys(request.session) : [],
        user: request.session?.user,
        jwt: request.session?.jwt,
        signature: request.session?.signature
      },
      headers: {
        authorization: request.headers.authorization,
        cookie: request.headers.cookie,
        host: request.headers.host,
        origin: request.headers.origin,
        referer: request.headers.referer
      },
      cookies: request.cookies,
      query: request.query,
      body: request.body,
      params: request.params,
      url: request.url,
      method: request.method
    }

    response.json({ 
      status: 200, 
      message: 'Debug session info', 
      data: debugInfo 
    })
  } catch (error) {
    response.json({ 
      status: 500, 
      message: 'Debug error', 
      data: { error: error.message } 
    })
  }
}

export async function debugMessagesController(request: Request, response: Response): Promise<void> {
  try {
    const groupId = request.query.groupId as string;
    const userId = request.query.userId as string;
    
    if (!groupId) {
      response.json({ status: 400, message: 'groupId required', data: null });
      return;
    }

    console.log('DEBUG: Getting messages for group', groupId, 'user', userId);

    // Check if group exists
    const groupCheck = await sql`
      SELECT group_id FROM "group" WHERE group_id = ${groupId}
    `;
    console.log('DEBUG: Group exists:', groupCheck.length > 0);

    // Check messages count
    const messageCount = await sql`
      SELECT COUNT(*) as count FROM group_message WHERE group_message_group_id = ${groupId}
    `;
    console.log('DEBUG: Total messages in group:', messageCount[0]?.count || 0);

    // Get actual messages
    const messages = await selectGroupMessagesByGroupId(groupId);
    console.log('DEBUG: Retrieved messages:', messages.length, messages);

    // Check membership
    let isMember = false;
    if (userId) {
      isMember = await checkUserGroupMembership(userId, groupId);
    }

    response.json({
      status: 200,
      message: 'Debug messages info',
      data: {
        groupExists: groupCheck.length > 0,
        totalMessages: messageCount[0]?.count || 0,
        retrievedMessages: messages.length,
        messages,
        isMember,
        groupId,
        userId
      }
    });
  } catch (error) {
    console.error('DEBUG: Error in debugMessagesController:', error);
    response.json({ 
      status: 500, 
      message: 'Debug error', 
      data: { error: error.message } 
    })
  }
}