"""Write rows to the activity log (US-20). Rows are append-only: nothing edits or deletes them."""

from .models import AuditLog


def who(user):
    return user.get_full_name() or user.first_name or user.username.title()


def record(user, action, entity, entity_id, summary):
    return AuditLog.objects.create(
        administrator=user,
        action=action,
        entity_name=entity,
        entity_id=entity_id,
        change_summary=summary,
    )
