require('dotenv').config();

/**
 *
 * @param {GuildMember} member - The guild member to check.
 * @param {Client} client - The bot client to access configs.
 * @returns {boolean} Whether the member is a DJ or admin.
 */
module.exports = function isDJ(member, client) {
  // Admins are always allowed
  if (member.permissions.has('Administrator')) return true;

  const guildId = member.guild.id;

  // 1. Server-specific DJ role from bot config
  const config = client.configs?.get(guildId);
  const configuredDJRoleId = config?.djRoleId;

  if (configuredDJRoleId && member.roles.cache.has(configuredDJRoleId)) {
    return true;
  }

  // 2. Global fallback DJ role from .env
  const envDJRoleId = process.env.DJ_ROLE_ID;
  if (envDJRoleId && member.roles.cache.has(envDJRoleId)) {
    return true;
  }

  // 3. No match
  return false;
};
