SELECT r.created_at, r.price, p.name, p.package, p.measure, p.size, c.name, r.id, p.id
FROM records r
JOIN products p ON p.id = r.product_id
JOIN chains c ON c.id = r.chain_id
ORDER BY p.name
